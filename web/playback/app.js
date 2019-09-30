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

if (!Array.prototype.find) {
    Object.defineProperty(Array.prototype, "find", {
        value: function (predicate) {
            var value;
            for (var i = 0; i < this.length; i++) {
                value = this[i];
                if (predicate.call(arguments[1], value, i, this)) {
                    return value;
                }
            }
            return undefined;
        }
    });
}

var url = window.location.protocol + '//' + window.location.host;
var token = (window.location.search.match(/token=([^&#]+)/) || [])[1];
var params = getJsonFromUrl(window.location.search);

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
var trackLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
        features: [trackFeature]
    }),
    style: trackStyle
});

var markers = {};

var layers = [
    new ol.layer.Tile({
        title: 'Satellite + Road View',
        type: 'base',
        visible: true,
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
        visible: false,
        source: new ol.source.XYZ({
            url: 'https://mt0.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}&s=Ga',
            attributions: 'Ethio GPS Tracking System'
        })
    }),
    trackLayer
];

var view = new ol.View({});

var map = new ol.Map({
    layers: layers,
    target: 'map',
    view: view
});

map.addControl(new ol.control.ScaleLine());
map.addControl(new ol.control.LayerSwitcher({
    tipLabel: 'Map Switcher'
}));

ajax('GET', url + '/api/server', function (server) {
    ajax('GET', url + '/api/session?token=' + token, function (user) {
        view.setCenter(ol.proj.fromLonLat([
            user.longitude || server.longitude || 0.0,
            user.latitude || server.latitude || 0.0
        ]));
        view.setZoom(user.zoom || server.zoom || 2);
        var routeURL = url + '/api/reports/route' + window.location.search;
        ajax('GET', url + '/api/devices', function (devices) {
            ajax('GET', routeURL, function (positions) {
                var device = devices.find(function (device) {
                    return device.id === positions[0].deviceId
                });
                var deviceName = device.plateNumber;
                if (deviceName === '') deviceName = device.name;
                // var psList = positions.map(function (position) {
                //     return position.longitude + ',' + position.latitude;
                // }).join(';');
                // var drivingURL = 'http://router.project-osrm.org/route/v1/driving/' + psList + '?overview=false';
                // ajax('GET', drivingURL, function (path) {
                //     console.log(path);
                // });
                for (var i = 0; i < positions.length - 1; i++) {
                    (function (i) {
                        window.setTimeout(function () {
                            var point = ol.proj.fromLonLat([positions[i].longitude, positions[i].latitude]);
                            var next = ol.proj.fromLonLat([positions[i+1].longitude, positions[i+1].latitude]);
                            trackFeature.getGeometry().appendCoordinate(next);
                            if (i % 2 == 0) {
                                view.animate({
                                    center: point,
                                    zoom: 17,
                                    duration: 800
                                });
                            }
                        }, i * 800);

                    }(i));
                }
            });
        });
    });
});
