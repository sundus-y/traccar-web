Ext.define('Traccar.view.SMSNotificationsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.smsNotifications',

    messageRenderer: function(value, p, record) {
        return value.replace(/(?:\r\n|\r|\n)/g, '<br>');
    },

    onShowClick: function () {
        Ext.getStore('SMSNotifications').load({
            params: {
                deviceId: this.getView().getBubbleParent().deviceId,
                from: this.lookupReference('fromDateField').getValue().getTime(),
                to: this.lookupReference('toDateField').getValue().getTime()
            }
        });
    },

    onPeriodChange: function (combobox, newValue) {
        var from, to, range = Traccar.AttributeFormatter.periodToDateRange(newValue);
        from = range['from'];
        to = range['to'];
        this.lookupReference('fromDateField').setValue(from);
        this.lookupReference('toDateField').setValue(to);
    }
});
