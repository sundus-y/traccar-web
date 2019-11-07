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

Ext.define('Traccar.view.edit.DevicesTreeViewController', {
    extend: 'Traccar.view.edit.ToolbarController',
    alias: 'controller.devicesTreeView',

    requires: [
        'Traccar.view.dialog.SendCommand',
        'Traccar.view.dialog.Device',
        'Traccar.view.permissions.Geofences',
        'Traccar.view.permissions.ComputedAttributes',
        'Traccar.view.permissions.Drivers',
        'Traccar.view.permissions.SavedCommands',
        'Traccar.view.BaseWindow',
        'Traccar.view.SMSNotifications',
        'Traccar.model.Device',
        'Traccar.model.Command'
    ],

    config: {
        listen: {
            controller: {
                '*': {
                    selectreport: 'deselectDevice',
                    selectevent: 'deselectDevice'
                },
                'root': {
                    selectdevice: 'selectDevice'
                },
                'map': {
                    selectdevice: 'selectDevice',
                    deselectfeature: 'deselectFeature'
                }
            },
            store: {
                '#DevicesTree': {
                    update: 'onUpdateDevice',
                    datachanged: 'onDataChange'
                }
            }
        }
    },

    objectModel: 'Traccar.model.Device',
    objectDialog: 'Traccar.view.dialog.Device',
    removeTitle: Strings.sharedDevice,

    init: function () {
        var self = this;
        setInterval(function () {
            self.getView().getView().refresh();
        }, Traccar.Style.refreshPeriod);
    },

    onCommandClick: function () {
        var device, deviceId, dialog, typesStore, commandsStore;
        device = this.getView().getSelectionModel().getSelection()[0];
        deviceId = device.get('id');

        dialog = Ext.create('Traccar.view.dialog.SendCommand');
        dialog.deviceId = deviceId;

        commandsStore = dialog.lookupReference('commandsComboBox').getStore();
        commandsStore.getProxy().setExtraParam('deviceId', deviceId);
        if (!Traccar.app.getPreference('limitCommands', false)) {
            commandsStore.add({
                id: 0,
                description: Strings.sharedNew
            });
        }
        commandsStore.load({
            addRecords: true
        });

        typesStore = dialog.lookupReference('commandType').getStore();
        typesStore.getProxy().setExtraParam('deviceId', deviceId);
        typesStore.load();

        dialog.show();
    },

    onRemoveClick: function () {
        var objectInstance = this.getView().getSelectionModel().getSelection()[0];
        var dialog = Ext.create('Traccar.view.dialog.DeviceDeleteConfirm');
        dialog.objectInstance = objectInstance;
        dialog.show();
    },

    onViewClick: function () {
        var dialog, objectInstance = this.getView().getSelectionModel().getSelection()[0].get('original');
        dialog = Ext.create(this.objectDialog);
        dialog.down('form').loadRecord(objectInstance);
        dialog.down('form').items.items.forEach(function(item){
            item.setReadOnly && item.setReadOnly(true);
            item.items && item.items.items.forEach(function(item){
                item.setReadOnly && item.setReadOnly(true);
                item.items && item.items.items.forEach(function(item){
                    item.setReadOnly && item.setReadOnly(true);
                    item.items && item.items.items.forEach(function(item){
                        item.setReadOnly && item.setReadOnly(true);
                        item.items && item.items.items.forEach(function(item){
                            item.setReadOnly && item.setReadOnly(true);
                        });
                    });
                });
            });
        });
        dialog.lookupReference('saveButton').setHidden(true);
        dialog.lookupReference('showAttributeButton').setHidden(true);
        dialog.show();
    },

    onViewSMSClick: function () {
        var device, deviceId, dialog;
        device = this.getView().getSelectionModel().getSelection()[0].get('original');
        deviceId = device.get('id');
        dialog = Ext.create('Traccar.view.BaseWindow', {
            title: Strings.smsNotifications,
            items: {
                xtype: 'smsNotificationsView'
            }
        });
        dialog.deviceId = deviceId;
        dialog.show();
    },

    updateButtons: function (selected) {
        var empty = selected.length === 0;
        this.lookupReference('toolbarViewButton').setDisabled(empty);
        this.lookupReference('toolbarViewSMSButton').setDisabled(empty);
    },

    onSelectionChange: function (el, records) {
        if (records && records.length) {
            this.updateButtons(records);
            this.fireEvent('selectdevice', records[0].get('original'), true);
        }
    },

    selectDevice: function (device) {
        this.getView().getSelectionModel().select([device], false, true);
        this.updateButtons(this.getView().getSelectionModel().getSelected().items);
        this.getView().getView().focusRow(device);
    },

    deselectDevice: function (object) {
        if (object) {
            this.deselectFeature();
        }
    },

    onUpdateDevice: function () {
        this.updateButtons(this.getView().getSelectionModel().getSelected().items);
        this.onDataChange();
    },

    onDataChange: function() {
        var offline;
        var online;
        var total = offline = online = 0;
        this.getView().getStore().data.items[0].childNodes.forEach(function(cNode){
            cNode.childNodes.forEach(function (node) {
                total ++;
                if(node.data.status === 'online') online++;
                if(node.data.status === 'offline') offline++;
            })
        });
        this.lookupReference('deviceToolBarTitle')
            && this.lookupReference('deviceToolBarTitle')
                .setHtml("Devices (Online:" + online + " Offline:" + offline + " Total:" + total + ")");
    },

    deselectFeature: function () {
        this.getView().getSelectionModel().deselectAll();
    }
});
