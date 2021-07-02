/*
 * Copyright 2016 - 2017 Anton Tananaev (anton@traccar.org)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var url = window.location.protocol + '//' + window.location.host;
var token = (window.location.search.match(/token=([^&#]+)/) || [])[1];
var controller, marker, route, speedChart;
var duration = 1000;
var zoom = 19;
var playButton = document.getElementById('play');
var pauseButton = document.getElementById('pause');
var resumeButton = document.getElementById('resume');
var stopButton = document.getElementById('stop');
var dateTimeFormat = 'MM/DD/YYYY HH:mm::ss';
var speedChartConfig = {
    type: 'line',
    data: {
        labels: [],
        datasets: []
    },
    options: {
        title: {
            display: true,
            text: 'Speed Chart',
            position: 'left'
        },
        scales: {
            xAxes: [{
                type: 'time',
                time: {
                    parser: dateTimeFormat,
                    tooltipFormat: dateTimeFormat
                },
                scaleLabel: {
                    display: true,
                    labelString: 'Date/Time'
                }
            }],
            yAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'Km/h'
                },
                ticks: {
                    suggestedMin: 0,
                    suggestedMax: 40
                }
            }]
        },
    }
};

var style = function (label) {
    return new ol.style.Style({
        image: new ol.style.Circle({
            fill: new ol.style.Fill({
                color: 'teal'
            }),
            stroke: new ol.style.Stroke({
                color: 'black',
                width: 2
            }),
            radius: 7
        }),
        text: new ol.style.Text({
            text: label,
            fill: new ol.style.Fill({
                color: 'black'
            }),
            stroke: new ol.style.Stroke({
                color: 'white',
                width: 2
            }),
            font: 'bold 12px sans-serif',
            offsetY: -16
        })
    });
};

var trackStyle = new ol.style.Style({
    stroke: new ol.style.Stroke({
        color: 'rgba(0,0,255,1.0)',
        width: 3,
        lineCap: 'round'
    })
});

var trackFeature = new ol.Feature({
    geometry: new ol.geom.LineString([])
});

var source = new ol.source.Vector({
    features: [trackFeature]
});

var trackLayer = new ol.layer.Vector({
    source: source,
    style: trackStyle,
});

var markers = {};

var layers = [
    new ol.layer.Tile({
        title: 'Satellite + Road View',
        type: 'base',
        visible: false,
        source: new ol.source.XYZ({
            url: 'https://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}&s=Ga',
            attributions: 'Ethio GPS Tracking System'
        })
    }),
    new ol.layer.Tile({
        title: 'Satellite View',
        visible: false,
        type: 'base',
        source: new ol.source.XYZ({
            url: 'https://mt0.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}&s=Ga',
            attributions: 'Ethio GPS Tracking System'
        })
    }),
    new ol.layer.Tile({
        title: 'Road View',
        type: 'base',
        visible: true,
        source: new ol.source.XYZ({
            url: 'https://mt0.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}&s=Ga',
            attributions: 'Ethio GPS Tracking System'
        })
    }),
    trackLayer
];

var view = new ol.View({
    center: ol.proj.fromLonLat([0.0, 0.0]),
    zoom: 2
});

var map = new ol.Map({
    layers: layers,
    target: 'map',
    view: view
});

map.addControl(new ol.control.ScaleLine());
map.addControl(new ol.control.LayerSwitcher({
    tipLabel: 'Map Switcher'
}));

height = (window.innerHeight)/3;
map.setSize([1640, height*2]);

init();

function init() {
    document.getElementById('from').value = new moment().startOf('day').format('YYYY-MM-DDThh:mm');
    document.getElementById('to').value = new moment().endOf('day').format('YYYY-MM-DDThh:mm');
    var ctx = document.getElementById('speedChart').getContext('2d');
    speedChart = new Chart(ctx, speedChartConfig);
    ajax('GET', url + '/api/server', function (server) {
        ajax('GET', url + '/api/session?token=' + token, function (user) {
            if(user === 404) {
                window.location.replace(url);
            }
            view.setCenter(ol.proj.fromLonLat([
                user.longitude || server.longitude || 0.0,
                user.latitude || server.latitude || 0.0
            ]));
            view.setZoom(user.zoom || server.zoom || 2);
            ajax('GET', '/api/devices', function (devices) {
                var sel = document.getElementById('devices');
                devices.sort(function (device1, device2) {
                    if (device1.name.toUpperCase() > device2.name.toUpperCase()) {
                        return 1;
                    } else {
                        return -1;
                    }
                });
                for (var i = 0; i < devices.length; i++) {
                    var opt = document.createElement('option');
                    opt.appendChild(document.createTextNode(devices[i].name.toUpperCase() + ' - ' + devices[i].plateNumber.toUpperCase() + ' - ' + devices[i].phone));
                    opt.value = devices[i].id;
                    sel.appendChild(opt);
                }
            });
        });
    });
}

function play() {
    stop();
    var deviceId = document.getElementById('devices').value;
    var mFromDate = moment(document.getElementById('from').value);
    var mToDate = moment(document.getElementById('to').value);
    var fromDate = mFromDate.format("YYYY-MM-DDThh:mm:ss.000[Z]");
    var toDate = mToDate.format("YYYY-MM-DDThh:mm:ss.000[Z]");
    playButton.disabled = resumeButton.disabled = true;
    pauseButton.disabled = stopButton.disabled = false;
    if (deviceId === "Select A Device") {
        alert("Please Select A Device First");
        playButton.disabled = false;
        pauseButton.disabled = resumeButton.disabled = stopButton.disabled = true;
    } else {
        var routeURL = url + '/api/reports/route?deviceId=' + deviceId + '&from=' + encodeURIComponent(fromDate) + '&to=' + encodeURIComponent(toDate);
        ajax('GET', url + '/api/devices', function (devices) {
            ajax('GET', routeURL, function (positions) {
                route = positions;
                if (route.length === 0) {
                    alert("No Route Found witht the given time range.\n " +
                        mFromDate.format("dddd, MMMM Do YYYY, h:mm:ss a") + ' - ' +
                        mToDate.format("dddd, MMMM Do YYYY, h:mm:ss a"));
                    playButton.disabled = false;
                    pauseButton.disabled = resumeButton.disabled = stopButton.disabled = true;
                } else {
                    var device = devices.find(function (device) {
                        return device.id === route[0].deviceId
                    });
                    var deviceName = device.plateNumber;
                    if (deviceName === '') deviceName = device.name;

                    var pointGeom = new ol.geom.Point(ol.proj.fromLonLat([route[0].longitude, route[0].latitude]));
                    marker = new ol.Feature(pointGeom);
                    marker.setStyle(style(deviceName));
                    source.addFeature(marker);
                    view.setCenter(pointGeom.getCoordinates());
                    addNewDataSet(deviceName, positions);
                    addData(positions[0]);
                    animateMarker(marker, pointGeom, trackFeature);
                    view.animate({
                        center: pointGeom.getCoordinates(),
                        zoom: zoom,
                        duration: 900
                    });
                    controller = setInterval(playback(route), 90);
                }
            });
        });
    }
}

function addNewDataSet(deviceName) {
    var newDataset = {
        label: deviceName,
        borderColor: 'rgba(255, 99, 132, 0.2)',
        backgroundColor: 'rgba(255, 99, 132, 1)',
        fill: false,
        spanGaps: false,
        data: []
    };
    speedChartConfig.data.datasets = [newDataset];
    speedChart.update();
}

function addData(position) {
    if (speedChartConfig.data.datasets.length === 1) {
        speedChartConfig.data.datasets[0].data.push({
            x: moment(position.serverTime).format(dateTimeFormat),
            y: position.speed
        });
        speedChart.update();
    }
}

function pause() {
    if (controller) {
        clearTimeout(controller);
        pauseButton.disabled = playButton.disabled = true;
        resumeButton.disabled = stopButton.disabled = false;
    }
}

function resume() {
    controller = setInterval(playback(route), 90);
    pauseButton.disabled = stopButton.disabled = false;
    playButton.disabled = resumeButton.disabled = true;
}

function stop() {
    if (controller) {
        clearTimeout(controller);
        if (trackFeature) {
            source.removeFeature(trackFeature);
            trackFeature = new ol.Feature({
                geometry: new ol.geom.LineString([])
            });
            source.addFeature(trackFeature);
        }
        if (marker) {
            source.removeFeature(marker);
            marker = null;
        }
        playButton.disabled = false;
        pauseButton.disabled = resumeButton.disabled = stopButton.disabled = true;
    }
}

function updatePlaybackSpeed() {
    duration = parseInt(document.getElementById('speed').value);
    if (duration === 20) {
        zoom = 14;
    }
    else if (duration === 50) {
        zoom = 15;
    }
    else if (duration === 100) {
        zoom = 16;
    } else if (duration === 250) {
        zoom = 17;
    } else {
        zoom = 19;
    }
}

function playback(positions) {
    return function () {
        if (!marker.get('animating') && positions.length > 0) {
            var position = positions.shift();
            var point = ol.proj.fromLonLat([position.longitude, position.latitude]);
            var pointGeom = new ol.geom.Point(point);
            var extent = map.getView().calculateExtent(map.getSize());
            var top = ol.extent.getTopRight(extent)[1] - 20;
            var right = ol.extent.getTopRight(extent)[0] - 20;
            var bottom = ol.extent.getBottomLeft(extent)[1] + 20;
            var left = ol.extent.getTopLeft(extent)[0] + 20;
            if (point[1] > top || point[0] > right || point[1] < bottom || point[0] < left) {
                view.animate({
                    center: pointGeom.getCoordinates(),
                    zoom: zoom,
                    duration: 1000
                });
            }
            addData(position);
            animateMarker(marker, pointGeom, trackFeature);
        } else if (positions.length === 0) {
            clearTimeout(controller);
            playButton.disabled = false;
            pauseButton.disabled = resumeButton.disabled = stopButton.disabled = true;
        }
    };
}
