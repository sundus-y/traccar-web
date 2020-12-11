/*
 * Copyright 2016 - 2018 Anton Tananaev (anton@traccar.org)
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

Ext.define('Traccar.view.map.BaseMap', {
    extend: 'Ext.panel.Panel',
    xtype: 'baseMapView',

    layout: 'fit',

    getMap: function () {
        return this.map;
    },

    getMapView: function () {
        return this.mapView;
    },

    initMap: function (layer_url) {
        var server, layer, type, bingKey, lat, lon, zoom, maxZoom, target, poiLayer, self = this;
        var overlay, customMapPopup, customMapPopupContent;
        server = Traccar.app.getServer();

        type = Traccar.app.getPreference('map', null);
        bingKey = server.get('bingKey');

        switch (type) {
            case 'custom':
                layer = new ol.layer.Tile({
                    source: new ol.source.XYZ({
                        url: Ext.String.htmlDecode(server.get('mapUrl')),
                        attributions: ''
                    })
                });
                break;
            case 'customArcgis':
                layer = new ol.layer.Tile({
                    source: new ol.source.TileArcGISRest({
                        url: Ext.String.htmlDecode(server.get('mapUrl'))
                    })
                });
                break;
            case 'bingRoad':
                layer = new ol.layer.Tile({
                    source: new ol.source.BingMaps({
                        key: bingKey,
                        imagerySet: 'Road'
                    })
                });
                break;
            case 'bingAerial':
                layer = new ol.layer.Tile({
                    source: new ol.source.BingMaps({
                        key: bingKey,
                        imagerySet: 'Aerial'
                    })
                });
                break;
            case 'bingHybrid':
                layer = new ol.layer.Tile({
                    source: new ol.source.BingMaps({
                        key: bingKey,
                        imagerySet: 'AerialWithLabels'
                    })
                });
                break;
            case 'carto':
                layer = new ol.layer.Tile({
                    source: new ol.source.XYZ({
                        url: 'https://cartodb-basemaps-{a-d}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',
                        attributions: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> ' +
                            'contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    })
                });
                break;
            case 'baidu':
                layer = new ol.layer.Tile({
                    source: new ol.source.XYZ({
                        projection: 'BD-MC',
                        tileUrlFunction: function (tileCoord) {
                            var urlsLength = 5, z = tileCoord[0], x = tileCoord[1], y = tileCoord[2], hash, index;

                            hash = (x << z) + y;
                            index = hash % urlsLength;
                            index = index < 0 ? index + urlsLength : index;

                            if (x < 0) {
                                x = 'M' + -x;
                            }
                            if (y < 0) {
                                y = 'M' + -y;
                            }
                            return 'https://online{}.map.bdimg.com/onlinelabel/?qt=tile&x={x}&y={y}&z={z}&styles=pl'
                                .replace('{}', index).replace('{x}', x).replace('{y}', y).replace('{z}', z);
                        },
                        tileGrid: new ol.tilegrid.TileGrid({
                            extent: ol.proj.transformExtent([-180, -74, 180, 74], 'EPSG:4326', 'BD-MC'),
                            origin: [0, 0],
                            minZoom: 3,
                            resolutions: [
                                262144, 131072, 65536, 32768, 16384, 8192, 4096, 2048,
                                1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5
                            ]
                        }),
                        attributions: '&copy; <a href="https://map.baidu.com/">Baidu</a>'
                    })
                });
                break;
            case 'yandexMap':
                layer = new ol.layer.Tile({
                    source: new ol.source.XYZ({
                        url: 'https://vec0{1-4}.maps.yandex.net/tiles?l=map&x={x}&y={y}&z={z}',
                        projection: 'EPSG:3395',
                        attributions: '&copy; <a href="https://yandex.com/maps/">Yandex</a>'
                    })
                });
                break;
            case 'yandexSat':
                layer = new ol.layer.Tile({
                    source: new ol.source.XYZ({
                        url: 'https://sat0{1-4}.maps.yandex.net/tiles?l=sat&x={x}&y={y}&z={z}',
                        projection: 'EPSG:3395',
                        attributions: '&copy; <a href="https://yandex.com/maps/">Yandex</a>'
                    })
                });
                break;
            case 'osm':
                layer = new ol.layer.Tile({
                    source: new ol.source.OSM({})
                });
                break;
            default:
                layer = new ol.layer.Tile({
                    source: new ol.source.OSM({
                        url: 'https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png'
                    })
                });
                break;
        }

        lat = Traccar.app.getPreference('latitude', Traccar.Style.mapDefaultLat);
        lon = Traccar.app.getPreference('longitude', Traccar.Style.mapDefaultLon);
        zoom = Traccar.app.getPreference('zoom', Traccar.Style.mapDefaultZoom);
        maxZoom = Traccar.app.getAttributePreference('web.maxZoom', Traccar.Style.mapMaxZoom);

        this.mapView = new ol.View({
            center: ol.proj.fromLonLat([lon, lat]),
            zoom: zoom,
            maxZoom: maxZoom
        });

        var layers = [
            new ol.layer.Tile({
                title: 'Satellite + Road View',
                type: 'base',
                visible: false,
                source: new ol.source.XYZ({
                    url: 'https://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}&s=Ga',
                    attributions: ''
                })
            }),
            new ol.layer.Tile({
                title: 'Satellite View',
                visible: false,
                type: 'base',
                source: new ol.source.XYZ({
                    url: 'https://mt0.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}&s=Ga',
                    attributions: ''
                })
            }),
            new ol.layer.Tile({
                title: 'Road View',
                type: 'base',
                visible: true,
                source: new ol.source.XYZ({
                    url: 'https://mt0.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}&s=Ga',
                    attributions: ''
                })
            })
        ];

        customMapPopup = document.getElementById('customMapPopup');
        customMapPopupContent = document.getElementById('popup-content');
        overlay = new ol.Overlay({
            element: customMapPopup,
            autoPan: true,
            autoPanAnimation: {
                duration: 250
            }
        });

        this.map = new ol.Map({
            target: 'customMapContainer',
            layers: layers,
            overlays: [overlay],
            view: this.mapView
        });

        poiLayer = Traccar.app.getPreference('poiLayer', null);

        if (poiLayer) {
            this.map.addLayer(new ol.layer.Vector({
                source: new ol.source.Vector({
                    url: poiLayer,
                    format: new ol.format.KML()
                })
            }));
        }

        this.body.dom.tabIndex = 0;

        switch (Traccar.app.getAttributePreference('distanceUnit', 'km')) {
            case 'mi':
                this.map.addControl(new ol.control.ScaleLine({
                    units: 'us'
                }));
                break;
            case 'nmi':
                this.map.addControl(new ol.control.ScaleLine({
                    units: 'nautical'
                }));
                break;
            default:
                this.map.addControl(new ol.control.ScaleLine());
                break;
        }

        this.map.addControl(new ol.control.LayerSwitcher({
            tipLabel: 'Map Switcher'
        }));

        target = this.map.getTarget();
        if (typeof target === 'string') {
            target = Ext.get(target).dom;
        }

        this.map.on('pointermove', function (e) {
            var coordinate, record, plateNumber, position, speed, lastUpdatedAt, lastLocation;
            var hit = this.forEachFeatureAtPixel(e.pixel, function (feature,layer) {
                return {feature: feature, layer: layer};
            });
            if (hit) {
                target.style.cursor = 'pointer';
                if(!hit["layer"].get('name')) {
                    record = hit["feature"].get('record');
                    coordinate = hit["feature"].get('geometry').flatCoordinates;
                    plateNumber = record.get('newPlateNumber') ? record.get('newPlateNumber') : record.get('plateNumber');
                    position = Ext.getStore('LatestPositions').findRecord('deviceId', record.get('id'), 0, false, false, true);
                    if (position) {
                        speed = position.get('speed') ? position.get('speed').toFixed() : 0;
                    } else {
                        speed = 0;
                    }
                    if (position) {
                        lastUpdatedAt = position.get('fixTime') ? position.get('fixTime').toLocaleString() : 'Unknown';
                    } else {
                        lastUpdatedAt = 'Unknown';
                    }
                    lastLocation = position ? position.get('address') : 'Unknown';
                    customMapPopupContent.innerHTML = '<ul>' +
                            '<li>Owner Name: <b>' + record.get('contact') + '</b></li>' +
                            '<li>Group/Company: <b>' + record.get('groupName') + '</b></li>' +
                            '<li>Phone Number: <b>' + record.get('phone') + '</b></li>' +
                        '</ul>' +
                        '<hr>' +
                        '<ul>' +
                            '<li>Plate Number: <b>' + plateNumber + '</b></li>' +
                            '<li>Vehicle Model: <b>' + record.get('vehicleModel') + '</b></li>' +
                            '<li>Chassis Number: <b>' + record.get('chassisNumber') + '</b></li>' +
                            '<li>Engine Number: <b>' + record.get('engineNumber') + '</b></li>' +
                        '</ul>' +
                        '<hr>' +
                        '<ul>' +
                            '<li>IMEI Number: <b>' + record.get('uniqueId') + '</b></li>' +
                            '<li>SIM Number: <b>' + record.get('simNumber') + '</b></li>' +
                            '<li>Last Speed: <b>' + speed + ' Km/h </b></li>' +
                            '<li>Last Updated at: <b>' + lastUpdatedAt + '</b></li>' +
                            '<li>Last Location: <b>' + lastLocation + '</b></li>' +
                        '</ul>';
                    overlay.setPosition(coordinate);
                } else {
                    customMapPopupContent.innerHTML = '';
                    overlay.setPosition(undefined);
                }
            } else {
                target.style.cursor = '';
                customMapPopupContent.innerHTML = '';
                overlay.setPosition(undefined);
            }
        });

        this.map.on('click', function (e) {
            var i, features = self.map.getFeaturesAtPixel(e.pixel, {
                layerFilter: function (layer) {
                    return !layer.get('name');
                }
            });
            if (features) {
                for (i = 0; i < features.length; i++) {
                    self.fireEvent('selectfeature', features[i]);
                }
            } else {
                self.fireEvent('deselectfeature');
            }
        });
    },

    listeners: {
        afterrender: function () {
            this.initMap();
        },

        resize: function () {
            this.map.updateSize();
        }
    }
}, function () {
    var projection;
    proj4.defs('BD-MC', '+proj=merc +lon_0=0 +units=m +ellps=clrk66 +no_defs');
    proj4.defs('EPSG:3395', '+proj=merc +lon_0=0 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs');
    ol.proj.proj4.register(proj4);
    projection = ol.proj.get('EPSG:3395');
    if (projection) {
        projection.setExtent([-20037508.342789244, -20037508.342789244, 20037508.342789244, 20037508.342789244]);
    }
});
