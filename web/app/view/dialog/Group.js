/*
 * Copyright 2016 - 2017 Anton Tananaev (anton@traccar.org)
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

Ext.define('Traccar.view.dialog.Group', {
    extend: 'Traccar.view.dialog.BaseEdit',

    requires: [
        'Traccar.view.ClearableComboBox',
        'Traccar.view.UnescapedTextField'
    ],

    title: Strings.groupDialog,

    items: {
        xtype: 'form',
        items: [{
            xtype: 'fieldset',
            title: Strings.sharedRequired,
            items: [{
                xtype: 'unescapedTextField',
                name: 'name',
                fieldLabel: Strings.sharedName,
                allowBlank: false
            }, {
                xtype: 'unescapedTextField',
                name: 'managerName',
                fieldLabel: Strings.groupManagerName
            }, {
                xtype: 'unescapedTextField',
                name: 'contactNumber1',
                fieldLabel: Strings.groupContactNumber1
            }, {
                xtype: 'unescapedTextField',
                name: 'tinNumber',
                fieldLabel: Strings.groupTINNumber
            }, {
                xtype: 'unescapedTextField',
                name: 'licenseNumber',
                fieldLabel: Strings.groupLicenseNumber
            }]
        }, {
            xtype: 'fieldset',
            title: Strings.sharedExtra,
            collapsible: true,
            collapsed: false,
            items: [{
                xtype: 'unescapedTextField',
                name: 'contactNumber2',
                fieldLabel: Strings.groupContactNumber2
            }, {
                xtype: 'unescapedTextField',
                name: 'contactNumber3',
                fieldLabel: Strings.groupContactNumber3
            }, {
                xtype: 'unescapedTextField',
                name: 'address',
                fieldLabel: Strings.groupAddress
            }, {
                xtype: 'textareafield',
                name: 'note',
                fieldLabel: Strings.groupNote
            }, {
                xtype: 'clearableComboBox',
                name: 'groupId',
                fieldLabel: Strings.groupParent,
                store: 'Groups',
                queryMode: 'local',
                displayField: 'name',
                valueField: 'id'
            }]
        }]
    }
});
