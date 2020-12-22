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

Ext.define('Traccar.view.edit.CustomMapLocationsController', {
    extend: 'Traccar.view.edit.ToolbarController',
    alias: 'controller.customMapLocations',

    requires: [
        'Traccar.view.dialog.CustomMapLocation',
        'Traccar.model.CustomMapLocation'
    ],

    objectModel: 'Traccar.model.CustomMapLocation',
    objectDialog: 'Traccar.view.dialog.CustomMapLocation',
    removeTitle: Strings.customMapLocation
});
