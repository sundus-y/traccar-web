/*
 * Copyright 2015 - 2018 Anton Tananaev (anton@traccar.org)
 * Copyright 2017 - 2018 Andrey Kunitsyn (andrey@traccar.org)
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

Ext.define('Traccar.model.Event', {
    extend: 'Ext.data.Model',
    identifier: 'negative',

    fields: [{
        name: 'id',
        type: 'int'
    }, {
        name: 'type',
        type: 'string'
    }, {
        name: 'serverTime',
        type: 'date',
        dateFormat: 'c'
    }, {
        name: 'deviceId',
        type: 'int'
    }, {
        name: 'positionId',
        type: 'int'
    }, {
        name: 'geofenceId',
        type: 'int'
    }, {
        name: 'maintenanceId',
        type: 'int'
    }, {
        name: 'text',
        convert: function (v, rec) {
            var text, alarmKey, geofence, maintenance;
            if (rec.get('type') === 'commandResult') {
                text = Strings.eventCommandResult + ': ' + rec.get('attributes')['result'];
            } else if (rec.get('type') === 'alarm' && rec.get('attributes')['alarm'] === 'hardBraking') {
                var previousSpeed = Traccar.AttributeFormatter.speedFormatter(Traccar.AttributeFormatter.speedConverter(rec.get('attributes')['previousSpeed']));
                var currentSpeed = Traccar.AttributeFormatter.speedFormatter(Traccar.AttributeFormatter.speedConverter(rec.get('attributes')['currentSpeed']));
                text = 'Crash: Hard Braking from ' + previousSpeed.substring(0, previousSpeed.length - 4) + ' to ' + currentSpeed + '.';
            } else if (rec.get('type') === 'alarm') {
                alarmKey = rec.get('attributes')['alarm'];
                alarmKey = 'alarm' + alarmKey.charAt(0).toUpperCase() + alarmKey.slice(1);
                text = Strings[alarmKey] || alarmKey;
            } else if (rec.get('type') === 'textMessage') {
                text = Strings.eventTextMessage + ': ' + rec.get('attributes')['message'];
            } else if (rec.get('type') === 'driverChanged') {
                text = Strings.eventDriverChanged + ': ' +
                    Traccar.AttributeFormatter.driverUniqueIdFormatter(rec.get('attributes')['driverUniqueId']);
            } else if (rec.get('type') === 'deviceOverspeed') {
                var speed = Traccar.AttributeFormatter.speedFormatter(Traccar.AttributeFormatter.speedConverter(rec.get('attributes')['speed']));
                var limit = Traccar.AttributeFormatter.speedFormatter(Traccar.AttributeFormatter.speedConverter(rec.get('attributes')['speedLimit']));
                text = Strings.positionSpeed + ': ' + speed;
                text += ' (' + Strings.attributeSpeedLimit + ': ' + limit + ')';
            } else {
                text = Traccar.app.getEventString(rec.get('type'));
            }
            if (rec.get('geofenceId')) {
                geofence = Ext.getStore('Geofences').getById(rec.get('geofenceId'));
                if (geofence) {
                    text += ' "' + geofence.get('name') + '"';
                }
            }
            if (rec.get('maintenanceId')) {
                maintenance = Ext.getStore('Maintenances').getById(rec.get('maintenanceId'));
                if (maintenance) {
                    text += ' "' + maintenance.get('name') + '"';
                }
            }
            return text;
        },
        depends: ['type', 'attributes', 'geofenceId', 'maintenanceId']
    }, {
        name: 'attributes'
    }, {
        name: 'warning',
        convert: function (v, rec) {
            var warning;
            if (rec.get('type') === 'alarm' && rec.get('attributes')['alarm'] === 'hardBraking') {
                warning = true;
            } else {
                warning = false;
            }
            return warning;
        },
        depends: ['type', 'attributes']
    }]
});
