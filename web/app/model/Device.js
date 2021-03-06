/*
 * Copyright 2015 Anton Tananaev (anton@traccar.org)
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

Ext.define('Traccar.model.Device', {
    extend: 'Ext.data.Model',
    identifier: 'negative',

    fields: [{
        name: 'id',
        type: 'int'
    }, {
        name: 'name',
        type: 'string'
    }, {
        name: 'uniqueId',
        type: 'string'
    }, {
        name: 'phone',
        type: 'string',
        allowNull: true
    }, {
        name: 'model',
        type: 'string',
        allowNull: true
    }, {
        name: 'contact',
        type: 'string',
        allowNull: true
    }, {
        name: 'category',
        type: 'string',
        allowNull: true
    }, {
        name: 'status',
        type: 'string',
        allowNull: true
    }, {
        name: 'lastUpdate',
        type: 'date',
        dateFormat: 'c'
    }, {
        name: 'groupId',
        type: 'int'
    }, {
        name: 'disabled',
        type: 'boolean'
    }, {
        name: 'geofenceIds'
    }, {
        name: 'attributes'
    }, {
        name: 'plateNumber',
        type: 'string',
        allowNull: true
    }, {
        name: 'newPlateNumber',
        type: 'string',
        allowNull: true
    }, {
        name: 'membershipDate',
        type: 'date',
        dateFormat: 'c',
        allowNull: true
    }, {
        name: 'membershipRenewalDate',
        type: 'date',
        dateFormat: 'c',
        allowNull: true
    }, {
        name: 'vehicleModel',
        type: 'string',
        allowNull: true
    }, {
        name: 'gender',
        type: 'string',
        allowNull: true
    }, {
        name: 'countryOfManufacturing',
        type: 'string',
        allowNull: true
    }, {
        name: 'manufacturingYear',
        type: 'string',
        allowNull: true
    }, {
        name: 'engineNumber',
        type: 'string',
        allowNull: true
    }, {
        name: 'chassisNumber',
        type: 'string',
        allowNull: true
    }, {
        name: 'simNumber',
        type: 'string',
        allowNull: true
    }, {
        name: 'simIccidNumber',
        type: 'string',
        allowNull: true
    }, {
        name: 'registrationSubCity',
        type: 'string',
        allowNull: true
    }, {
        name: 'hasOverspeed',
        type: 'boolean',
        allowNull: true
    }]
});
