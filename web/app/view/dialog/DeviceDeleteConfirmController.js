Ext.define('Traccar.view.dialog.DeviceDeleteConfirmController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.deviceDeleteConfirm',

    onDeviceIdentifierChange: function(field, val) {
        var deviceId = this.getView().objectInstance.data.uniqueId;
        if(deviceId === val) {
            this.getView().lookupReference('deleteButton').setDisabled(false);
        } else {
            this.getView().lookupReference('deleteButton').setDisabled(true);
        }
    },

    onDeleteClick: function () {
        var self = this;
        var objectInstance = this.getView().objectInstance;
        var name = objectInstance.data.name;
        var store = objectInstance.store;
        store.remove(objectInstance);
        store.sync({
            failure: function (batch) {
                store.rejectChanges();
                Traccar.app.showError(batch.exceptions[0].getError().response);
            },
            success: function() {
                Traccar.app.showToast(Strings.deviceDeletedTitle, name);
                self.getView().hide();
            }
        });
    }
});
