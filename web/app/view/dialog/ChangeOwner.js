Ext.define('Traccar.view.dialog.ChangeOwner', {
    extend: 'Traccar.view.dialog.BaseEdit',

    requires: [
        'Traccar.view.dialog.ChangeOwnerController'
    ],

    controller: 'changeOwner',

    title: Strings.changeOwner,
    layout: 'vbox',
    items: {
        xtype: 'form',
        items: [
            {
                xtype: 'fieldset',
                title: Strings.deviceNewContactDetails,
                layout: "column",
                items: [
                    {
                        xtype: 'container',
                        width: '300px',
                        items: [
                            {
                                xtype: 'unescapedTextField',
                                name: 'contact',
                                reference: 'contact',
                                fieldLabel: Strings.deviceContact
                            }, {
                                xtype: 'unescapedTextField',
                                name: 'gender',
                                reference: 'gender',
                                fieldLabel: Strings.attributeGender
                            }, {
                                xtype: 'unescapedTextField',
                                name: 'phone',
                                reference: 'phone',
                                fieldLabel: Strings.sharedPhone
                            }
                        ]
                    }
                ]
            }
        ]
    }
});