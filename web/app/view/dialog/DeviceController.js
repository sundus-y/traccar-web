/*
 * Copyright 2017 Anton Tananaev (anton@traccar.org)
 * Copyright 2017 Andrey Kunitsyn (andrey@traccar.org)
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

Ext.define('Traccar.view.dialog.DeviceController', {
    extend: 'Traccar.view.dialog.BaseEditController',
    alias: 'controller.device',

    requires: [
        'Traccar.view.BaseWindow',
        'Traccar.view.dialog.OwnerChangeHistory'
    ],

    init: function () {
        if (Traccar.app.getUser().get('administrator')) {
            this.lookupReference('disabledField').setHidden(false);
            this.lookupReference('changeOwnerButton').setHidden(false);
        }
    },

    onChangeOwner: function() {
        var device = this.getView().down('form').getRecord();
        var dialog = Ext.create('Traccar.view.dialog.ChangeOwner');
        dialog.ownerChanged = false;
        dialog.addListener('hide', function(dialog){
            if (dialog.ownerChanged) {
                Traccar.app.showToast('The Owner has been changed.', 'Device Updted');
                this.closeView();
            }
        }, this);
        dialog.down('form').loadRecord(device);
        dialog.lookupReference('contact').setValue('');
        dialog.lookupReference('gender').setValue('');
        dialog.lookupReference('phone').setValue('');
        dialog.show();
    },
    onShowOwnerHistory: function() {
        var device = this.getView().down('form').getRecord();
        var attr_keys = Object.keys(device.data.attributes);
        var hasPreviousOwner = attr_keys.some(function(k){return k.match(/Previous Owner .* Contact/)});
        var previousOwnerData = [];
        if (hasPreviousOwner) {
            Object.entries(device.data.attributes).forEach(function(entry) {
                var key = entry[0];
                var value = entry[1];
                var match_result = key.match(/Previous Owner (\d*) (.*)/);
                if (match_result) {
                    var index = parseInt(match_result[1]) - 1;
                    var k = match_result[2];
                    previousOwnerData[index] = previousOwnerData[index] || {};
                    previousOwnerData[index]['ID'] = index + 1;
                    previousOwnerData[index][k] = value;
                }
            });
        }

        var fields = [
            {name: 'ID', mapping: 'ID'},
            {name: 'Contact', mapping: 'Contact'},
            {name: 'Gender', mapping: 'Gender'},
            {name: 'Phone', mapping: 'Phone'},
            {name: 'End Date', mapping: 'End Date'}
        ];

        var gridStore = new Ext.data.JsonStore({
            fields: fields,
            data: previousOwnerData,
            root: 'records'
        });

        var cols = [
            { id : 'ID', header: "No", width: 50, sortable: true, dataIndex: 'ID'},
            {header: Strings.deviceContact, width: 220, sortable: true, dataIndex: 'Contact'},
            {header: Strings.attributeGender, width: 80, sortable: true, dataIndex: 'Gender'},
            {header: Strings.sharedPhone, width: 150, sortable: true, dataIndex: 'Phone'},
            {header: Strings.endDate, width: 300, sortable: true, dataIndex: 'End Date'}
        ];

        Ext.create('Traccar.view.BaseWindow', {
            title: Strings.showOwnerHistory,
            items: {
                xtype: 'ownerChangeHistoryView',
                store: gridStore,
                columns: cols,
                viewConfig:{
                    forceFit:true,
                    emptyText:'No Owner Change History.'
                }
            }
        }).show();
    }



});
