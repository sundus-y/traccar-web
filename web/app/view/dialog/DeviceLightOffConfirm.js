Ext.define('Traccar.view.dialog.DeviceLightOffConfirm', {
    extend: 'Traccar.view.dialog.Base',

    requires: [
        'Traccar.view.dialog.DeviceLightOffConfirmController'
    ],

    controller: 'deviceLightOffConfirm',

    title: Strings.verifyDeviceLightOff,
    layout: 'vbox',
    items: [
        {
            xtype: 'label',
            text: Strings.verifyLightOffMsgLine1
        },
        {
            xtype: 'label',
            text: Strings.verifyLightOffMsgLine2
        },
        {
            xtype: 'textfield',
            name: 'reason',
            reference: 'reason',
            fieldLabel: Strings.reasonLabel,
            allowBlank: false,
            listeners: {
                change: 'onReasonChange'
            }
        }
    ],
    buttons: [
        {
            text: Strings.turnOffLight,
            disabled: true,
            reference: 'lightOffButton',
            handler: 'onLightOffClick'
        }
    ]
});