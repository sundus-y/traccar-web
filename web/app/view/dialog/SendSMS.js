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

Ext.define('Traccar.view.dialog.SendSMS', {
    extend: 'Traccar.view.dialog.Base',

    requires: [
        'Traccar.view.dialog.SendSMSController'
    ],

    controller: 'sendSMS',
    title: Strings.sendSMS,

    items: [{
        fieldLabel: Strings.smsRecipientType,
        reference: 'smsRecipientType',
        xtype: 'combobox',
        store: 'SMSRecipientTypes',
        editable: false,
        valueField: 'key',
        displayField: 'name',
        queryMode: 'local',
        listeners: {
            change: 'onSMSRecipientTypeChange'
        }
    }, {
        fieldLabel: Strings.smsPhoneNumber,
        xtype: 'unescapedTextField',
        name: 'phoneNumber',
        reference: 'phoneNumber',
        hidden: true
    }, {
        fieldLabel: Strings.reportDevice,
        xtype: 'tagfield',
        reference: 'selectedDevices',
        maxWidth: Traccar.Style.formFieldWidth,
        store: 'Devices',
        valueField: 'id',
        displayField: 'name',
        queryMode: 'local',
        hidden: true
    }, {
        fieldLabel: Strings.reportGroup,
        xtype: 'tagfield',
        reference: 'selectedGroups',
        maxWidth: Traccar.Style.formFieldWidth,
        store: 'Groups',
        valueField: 'id',
        displayField: 'name',
        queryMode: 'local',
        hidden: true
    }, {
        fieldLabel: Strings.smsMessage,
        xtype: 'textareafield',
        reference: 'smsMessage',
        name: 'smsMessage',
        width: 350,
        height: 130,
        autoScroll: true
    }],

    buttons: [{
        text: Strings.commandSendSms,
        tooltip: Strings.commandSendSms,
        tooltipType: 'title',
        handler: 'onSendSMSClick'
    }, {
        glyph: 'xf00d@FontAwesome',
        tooltip: Strings.sharedCancel,
        tooltipType: 'title',
        minWidth: 0,
        handler: 'closeView'
    }]
});
