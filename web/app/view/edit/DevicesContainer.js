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

Ext.define('Traccar.view.edit.DevicesContainer', {
    extend: 'Ext.TabPanel',
    xtype: 'devicesViewContainer',

    requires: [
        'Traccar.view.edit.Devices',
        'Traccar.view.edit.DevicesTreeView'
    ],

    defaults: {
        styleHtmlContent: true
    },

    items: [
        {
            title: 'Grid View',
            xtype: 'devicesView'
        },
        {
            title: 'Tree View',
            xtype: 'devicesTreeView'
        }
    ],

    listeners: {
        afterrender: function(panel) {
            var bar = panel.tabBar;
            bar.insert(2, [{
                xtype: 'component',
                flex: 1
            }, {
                xtype: 'unescapedTextField',
                reference: 'nameTextField',
                name: 'name',
                emptyText: 'Type to filter devices . . .',
                width: 300,
                listeners: {
                    change: function(field, newValue, oldValue, eOpts) {
                        var searchGrid = function(val) {
                            var store = Ext.getStore('VisibleDevices');
                            store.clearFilter();
                            store.filter(new Ext.util.Filter({
                                filterFn: function(object) {
                                    var match = false;
                                    Ext.Object.each(object.data, function(prop, value) {
                                        match = match || (String(value).toLowerCase().indexOf(val.toLowerCase()) > -1);
                                    });
                                    return match;
                                }
                            }));
                            return true;
                        };

                        var searchTree = function(val) {
                            var store = Ext.getStore('DevicesTree');
                            store.clearFilter();
                            store.filter(new Ext.util.Filter({
                                filterFn: function(object) {
                                    var match = false;
                                    if (object.data.root || object.data.parentId === 'root') return true;
                                    var obj = object.data.original;
                                    Ext.Object.each(obj.data, function(prop, value) {
                                        match = match || (String(value).toLowerCase().indexOf(val.toLowerCase()) > -1);
                                    });
                                    return match;
                                }
                            }));
                            return true;
                        };

                        Traccar.app.debounce (function(){
                            searchGrid(newValue);
                            searchTree(newValue);
                        },200)();
                    }
                }
            }]);
        }
    }
});
