Ext.define('Traccar.view.dialog.SendGovEmailConfirm', {
    extend: 'Traccar.view.dialog.Base',

    requires: [
        'Traccar.view.dialog.SendGovEmailConfirmController'
    ],

    controller: 'sendGovEmailConfirm',

    title: Strings.verifySendGovEmail,
    layout: 'vbox',
    items: [
        {
            xtype: 'label',
            text: Strings.verifySendGovEmailMsgLine1
        },
        {
            xtype: 'label',
            text: Strings.verifySendGovEmailMsgLine2
        },
        {
            xtype: 'textfield',
            name: 'verificationText',
            fieldLabel: Strings.verificationText,
            allowBlank: false,
            listeners: {
                change: 'onVerificationTextChange'
            }
        }
    ],
    buttons: [
        {
            text: Strings.sendGovEmail,
            disabled: true,
            reference: 'sendButton',
            handler: 'onSendClick'
        }
    ]
});