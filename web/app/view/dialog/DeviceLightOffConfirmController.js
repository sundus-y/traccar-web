Ext.define('Traccar.view.dialog.DeviceLightOffConfirmController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.deviceLightOffConfirm',

    onReasonChange: function (field, val) {
        if (val.trim().length > 5) {
            this.getView().lookupReference('lightOffButton').setDisabled(false);
        } else {
            this.getView().lookupReference('lightOffButton').setDisabled(true);
        }
    },

    onLightOffClick: function () {
        var self = this;
        var objectInstance = this.getView().objectInstance;
        var reason = this.getView().lookupReference('reason').value;
        var device = objectInstance.data;
        Ext.Ajax.request({
            url: '/api/notifications/send_sms',
            method: 'POST',
            jsonData: {
                phone: device.simNumber,
                deviceIds: [device.id],
                groupIds: [device.groupId],
                cmd: 'OVERSPEED-OFF',
                reason: reason
            },
            success: function () {
                Traccar.app.showToast(Strings.deviceLightOffTitle, 'Command Queued');
                self.getView().hide();
            },
            failure: function (response) {
                Traccar.app.showError(response);
            }
        });
    }
});
