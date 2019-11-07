/*
 * Copyright 2016 - 2017 Anton Tananaev (anton@traccar.org)
 * Copyright 2016 - 2017 Andrey Kunitsyn (andrey@traccar.org)
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

Ext.define('Traccar.view.dialog.SendSMSController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.sendSMS',

    requires: [
        'Traccar.store.ReportEventTypes',
        'Traccar.store.AllNotifications'
    ],

    onSendSMSClick: function (button) {
        var receipientType, phone, deviceIds, groupIds, msg, errors = [];
        var phoneRegx = new RegExp(/\+2519\d{8}$/);
        receipientType = this.lookupReference('smsRecipientType').getValue();
        phone = this.lookupReference('phoneNumber').getValue();
        deviceIds = this.lookupReference('selectedDevices').getValue();
        groupIds = this.lookupReference('selectedGroups').getValue();
        msg = this.lookupReference('smsMessage').getValue();
        if (!receipientType) {
            errors.push("* Please select recipient type.");
        }
        if (receipientType == 'phoneNumber' && !phone.trim().match(phoneRegx)) {
            errors.push("* Invalid phone number, must be +2519xxxxxxxx format.");
        }
        if (receipientType == 'selectedDevices' && (deviceIds.length == 0)) {
            errors.push("* Please select one or more Devices.");
        }
        if (receipientType == 'selectedGroups' && (groupIds.length == 0)) {
            errors.push("* Please select one or more Group.");
        }
        if (msg.trim() == '') {
            errors.push("* Message can't be empty.");
        }
        if (receipientType == 'allDevices') {
            var allDevices = this.lookupReference('selectedDevices').store.data.items;
            deviceIds = [];
            for(var i=0; i < allDevices.length; i++) {
                deviceIds.push(allDevices[i].id);
            }
        }
        if (errors.length > 0 ){
            alert(errors.join("\n"));
        } else {
            this.sendSMS({phone: phone, deviceIds: deviceIds, groupIds: groupIds, msg: msg});
        }
    },

    onSMSRecipientTypeChange: function (combobox, newValue) {
        this.lookupReference('phoneNumber').setHidden(newValue !== 'phoneNumber');
        this.lookupReference('selectedDevices').setHidden(newValue !== 'selectedDevices');
        this.lookupReference('selectedGroups').setHidden(newValue !== 'selectedGroups');
    },

    sendSMS: function(data) {
        this.closeView();
        Ext.Ajax.request({
            url: '/api/notifications/send_sms',
            method: 'POST',
            jsonData: data,
            success: function () {
                Traccar.app.showToast('SMS Message had been Queued.', 'Message Queued');
            },
            failure: function (response) {
                Traccar.app.showError(response);
            }
        });
    }
});
