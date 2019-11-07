/*
 * Copyright 2015 - 2017 Anton Tananaev (anton@traccar.org)
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

Ext.define('Traccar.view.edit.DevicesTreeView', {
    extend: 'Ext.tree.Panel',
    xtype: 'devicesTreeView',

    requires: [
        'Traccar.AttributeFormatter',
        'Traccar.view.edit.DevicesTreeViewController',
        'Traccar.view.ArrayListFilter'
    ],

    controller: 'devicesTreeView',

    store: 'DevicesTree',

    stateful: true,
    stateId: 'devices-grid',

    tbar: {
        componentCls: 'toolbar-header-style',
        defaults: {
            xtype: 'button',
            disabled: true,
            tooltipType: 'title'
        },
        items: [{
            xtype: 'tbtext',
            reference: 'deviceToolBarTitle',
            html: Strings.deviceTitle,
            baseCls: 'x-panel-header-title-default'
        }, {
            handler: 'onViewClick',
            reference: 'toolbarViewButton',
            glyph: 'xf06e@FontAwesome',
            tooltip: Strings.sharedView
        }, {
            handler: 'onViewSMSClick',
            reference: 'toolbarViewSMSButton',
            glyph: 'xf27b@FontAwesome',
            tooltip: Strings.sharedViewSMS
        }]
    },

    listeners: {
        selectionchange: 'onSelectionChange'
    },

    viewConfig: {
        enableTextSelection: true,
        getRowClass: function (record) {
            var result = '', status = record.get('status');
            if (record.get('disabled')) {
                result = 'view-item-disabled ';
            }
            if (status) {
                result += Ext.getStore('DeviceStatuses').getById(status).get('color');
            }
            return result;
        }
    },

    columns: {
        defaults: {
            flex: 1,
            minWidth: Traccar.Style.columnWidthNormal
        },
        items: [
        {
            xtype: 'treecolumn',
            text: Strings.groupDialog,
            dataIndex: 'groupId',
            filter: {
                type: 'list',
                labelField: 'name',
                store: 'Groups'
            },
            renderer: function (value, m, r) {
                return Traccar.AttributeFormatter.getFormatter('groupId')(value)
                    || Traccar.AttributeFormatter.getFormatter('groupId')(r.get('id'));
            }

        }, {
            text: Strings.sharedName,
            dataIndex: 'name',
            filter: 'string'
        }, {
            text: Strings.deviceIdentifier,
            dataIndex: 'uniqueId',
            hidden: true,
            filter: 'string'
        }, {
            text: Strings.deviceModel,
            dataIndex: 'model',
            hidden: true,
            filter: 'string'
        }, {
            text: Strings.devicePlateNumber,
            dataIndex: 'plateNumber',
            hidden: true,
            filter: 'string'
        }, {
            text: Strings.vehicleModel,
            dataIndex: 'vehicleModel',
            hidden: true,
            filter: 'string'
        }, {
            text: Strings.membershipDate,
            dataIndex: 'membershipDate',
            renderer: Traccar.AttributeFormatter.getFormatter('membershipDate')
        }, {
            text: Strings.sharedPhone,
            dataIndex: 'phone',
            hidden: true,
            filter: 'string'
        }, {
            text: Strings.deviceContact,
            dataIndex: 'contact',
            hidden: true,
            filter: 'string'
        }, {
            text: Strings.attributeGender,
            dataIndex: 'gender',
            hidden: true,
            filter: 'string'
        }, {
            text: Strings.attributeCountryOfManufacturing,
            dataIndex: 'countryOfManufacturing',
            hidden: true,
            filter: 'string'
        }, {
            text: Strings.attributeManufacturingYear,
            dataIndex: 'manufacturingYear',
            hidden: true,
            filter: 'string'
        }, {
            text: Strings.attributeEngineNumber,
            dataIndex: 'engineNumber',
            hidden: true,
            filter: 'string'
        }, {
            text: Strings.attributeChassisNumber,
            dataIndex: 'chassisNumber',
            hidden: true,
            filter: 'string'
        }, {
            text: Strings.attributeSIMNumber,
            dataIndex: 'simNumber',
            hidden: true,
            filter: 'string'
        }, {
            text: Strings.attributeSIMICCIDNumber,
            dataIndex: 'simIccidNumber',
            hidden: true,
            filter: 'string'
        }, {
            text: Strings.sharedDisabled,
            dataIndex: 'disabled',
            renderer: Traccar.AttributeFormatter.getFormatter('disabled'),
            hidden: true,
            filter: 'boolean'
        }, {
            text: Strings.sharedGeofences,
            dataIndex: 'geofenceIds',
            hidden: true,
            filter: {
                type: 'arraylist',
                idField: 'id',
                labelField: 'name',
                store: 'Geofences'
            },
            renderer: function (value) {
                var i, name, result = '';
                if (Ext.isArray(value)) {
                    for (i = 0; i < value.length; i++) {
                        name = Traccar.AttributeFormatter.geofenceIdFormatter(value[i]);
                        if (name) {
                            result += name + (i < value.length - 1 ? ', ' : '');
                        }
                    }
                }
                return result;
            }
        }, {
            text: Strings.deviceStatus,
            dataIndex: 'status',
            filter: {
                type: 'list',
                labelField: 'name',
                store: 'DeviceStatuses'
            },
            renderer: function (value) {
                var status;
                if (value) {
                    status = Ext.getStore('DeviceStatuses').getById(value);
                    if (status) {
                        return status.get('name');
                    }
                }
                return null;
            }
        }, {
            text: Strings.deviceLastUpdate,
            dataIndex: 'lastUpdate',
            renderer: Traccar.AttributeFormatter.getFormatter('lastUpdate')
        }]
    }
});
