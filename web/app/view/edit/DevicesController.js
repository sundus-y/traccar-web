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

Ext.define('Traccar.view.edit.DevicesController', {
    extend: 'Traccar.view.edit.ToolbarController',
    alias: 'controller.devices',

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
                '#Devices': {
                    update: 'onUpdateDevice',
                    datachanged: 'onDataChange'
                }
            }
        }
    },

    objectModel: 'Traccar.model.Device',
    objectDialog: 'Traccar.view.dialog.Device',
    removeTitle: Strings.sharedDevice,
    sundus: '(Online: 311, Offline: 200, Total: 400)',

    init: function () {
        var self = this, readonly, deviceReadonly;
        deviceReadonly = Traccar.app.getPreference('deviceReadonly', false) && !Traccar.app.getUser().get('administrator');
        readonly = Traccar.app.getPreference('readonly', false) && !Traccar.app.getUser().get('administrator');
        this.lookupReference('toolbarAddButton').setDisabled(readonly || deviceReadonly);
        this.lookupReference('toolbarDeviceMenu').setHidden(readonly || deviceReadonly);

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

    onViewSMSClick: function () {
        var device, deviceId, dialog;
        device = this.getView().getSelectionModel().getSelection()[0];
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
        var readonly, deviceReadonly, empty, deviceMenu;
        deviceReadonly = Traccar.app.getPreference('deviceReadonly', false) && !Traccar.app.getUser().get('administrator');
        readonly = Traccar.app.getPreference('readonly', false) && !Traccar.app.getUser().get('administrator');
        empty = selected.length === 0;
        this.lookupReference('toolbarEditButton').setDisabled(empty || readonly || deviceReadonly);
        this.lookupReference('toolbarViewButton').setDisabled(empty);
        this.lookupReference('toolbarViewSMSButton').setDisabled(empty);
        this.lookupReference('toolbarRemoveButton').setDisabled(empty || readonly || deviceReadonly);
        deviceMenu = this.lookupReference('toolbarDeviceMenu');
        deviceMenu.device = empty ? null : selected[0];
        deviceMenu.setDisabled(empty);
        this.lookupReference('deviceCommandButton').setDisabled(empty || readonly);
    },

    onSelectionChange: function (el, records) {
        if (records && records.length) {
            this.updateButtons(records);
            this.fireEvent('selectdevice', records[0], true);
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
        var total = this.getView().getStore().data.length;
        var offline = this.getView().getStore().data.items.filter(function(d){return d.data.status === 'offline';}).length;
        var online = this.getView().getStore().data.items.filter(function(d){return d.data.status === 'online';}).length;
        this.lookupReference('deviceToolBarTitle').setHtml("Devices (Online:" + online + " Offline:" + offline + " Total:" + total + ")");
    },

    deselectFeature: function () {
        this.getView().getSelectionModel().deselectAll();
    }
});
