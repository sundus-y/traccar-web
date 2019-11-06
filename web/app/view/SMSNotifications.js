Ext.define('Traccar.view.SMSNotifications', {
    extend: 'Traccar.view.GridPanel',
    xtype: 'smsNotificationsView',

    requires: [
        'Traccar.view.SMSNotificationsController'
    ],

    controller: 'smsNotifications',
    store: 'SMSNotifications',

    tbar: {
        scrollable: true,
        items: [
        {
            xtype: 'datefield',
            reference: 'fromDateField',
            format: Traccar.Style.dateFormat,
            hidden: true,
            value: new Date(new Date().setHours(0, 0, 0, 0))
        }, {
            xtype: 'datefield',
            reference: 'toDateField',
            format: Traccar.Style.dateFormat,
            hidden: true,
            value: new Date(new Date().setHours(23, 59, 59, 999))
        }, {
            fieldLabel: Strings.reportPeriod,
            reference: 'periodField',
            xtype: 'combobox',
            store: 'ReportPeriods',
            editable: false,
            valueField: 'key',
            displayField: 'name',
            queryMode: 'local',
            value: 'today',
            listeners: {
                change: 'onPeriodChange'
            }
        }, '-', {
            text: Strings.reportShow,
            handler: 'onShowClick'
        }]
    },

    columns: {
        defaults: {
            flex: 1,
            minWidth: Traccar.Style.columnWidthNormal
        },
        items: [{
            text: Strings.sharedDateTime,
            dataIndex: 'sentTimestamp',
            maxWidth: 170
        }, {
            text: Strings.sharedPhone,
            dataIndex: 'phone',
            maxWidth: 130
        }, {
            text: Strings.commandMessage,
            dataIndex: 'msg',
            renderer: 'messageRenderer'
        }]
    }
});