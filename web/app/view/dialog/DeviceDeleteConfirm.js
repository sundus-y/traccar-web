Ext.define('Traccar.view.dialog.DeviceDeleteConfirm', {
    extend: 'Traccar.view.dialog.Base',

    requires: [
        'Traccar.view.dialog.DeviceDeleteConfirmController'
    ],

    controller: 'deviceDeleteConfirm',

    title: Strings.verifyDeviceDelete,
    layout: 'vbox',
    items: [
        {
            xtype: 'label',
            text: Strings.verifyMsgLine1
        },
        {
            xtype: 'label',
            text: Strings.verifyMsgLine2
        },
        {
            xtype: 'textfield',
            name: 'imeiNumber',
            fieldLabel: Strings.deviceIdentifier,
            allowBlank: false,
            listeners: {
                change: 'onDeviceIdentifierChange'
            }
        }
    ],
    buttons: [
        {
            text: 'Delete',
            disabled: true,
            reference: 'deleteButton',
            handler: 'onDeleteClick'
        }
    ]
});