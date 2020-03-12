Ext.define('Traccar.view.dialog.OwnerChangeHistory', {
    extend: 'Traccar.view.GridPanel',

    xtype: 'ownerChangeHistoryView',

    requires: [
        'Traccar.view.dialog.OwnerChangeHistoryController'
    ],

    controller: 'ownerChangeHistory'
});