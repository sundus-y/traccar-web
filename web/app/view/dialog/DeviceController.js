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

    init: function () {
        if (Traccar.app.getUser().get('administrator')) {
            this.lookupReference('disabledField').setHidden(false);
            this.lookupReference('changeOwnerButton').setDisabled(false);
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
    }

});
