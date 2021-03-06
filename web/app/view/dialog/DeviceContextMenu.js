Ext.define('Traccar.view.dialog.DeviceContextMenu', {
    extend: 'Ext.menu.Menu',
    items: [
        {
            text: Strings.sharedViewDevice,
            glyph: 'xf06e@FontAwesome',
            handler: function() {
                var objectInstance = this.parentMenu.device;
                var dialog = Ext.create('Traccar.view.dialog.Device');
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
                dialog.show();
            }
        }, {
            text: Strings.sharedViewSMS,
            glyph: 'xf27b@FontAwesome',
            hidden: true,
            reference: 'viewSMSButton',
            handler: function() {
                var dialog = Ext.create('Traccar.view.BaseWindow', {
                    title: Strings.smsNotifications,
                    items: {
                        xtype: 'smsNotificationsView'
                    }
                });
                dialog.deviceId = this.parentMenu.device.data.id;
                dialog.show();
            }
        }, {
            text: Strings.sendSMS,
            glyph: 'xf1d8@FontAwesome',
            hidden: true,
            reference: 'sendSMSButton',
            handler: function() {
                var objectInstance = this.parentMenu.device;
                var dialog = Ext.create('Traccar.view.dialog.SendSMS');
                dialog.lookupReference('smsRecipientType').setValue('selectedDevices');
                dialog.lookupReference('selectedDevices').setValue(objectInstance.data.id);
                dialog.show();
            }
        }, {
            text: Strings.turnOffOverspeedLight,
            glyph: 'xf0eb@FontAwesome',
            hidden: true,
            reference: 'turnOffOverspeedLightButton',
            handler: function() {
                var objectInstance = this.parentMenu.device;
                var dialog = Ext.create('Traccar.view.dialog.DeviceLightOffConfirm');
                dialog.objectInstance = objectInstance;
                dialog.show();
            }
        }
    ]
});