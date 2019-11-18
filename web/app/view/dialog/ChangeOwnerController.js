Ext.define('Traccar.view.dialog.ChangeOwnerController', {
    extend: 'Traccar.view.dialog.BaseEditController',
    alias: 'controller.changeOwner',

    init: function () {
        this.lookupReference('showAttributeButton').setHidden(true);
    },

    onSaveClick: function (button) {
        var dialog = button.up('window');
        var record = dialog.down('form').getRecord();
        var existingAttributes = record.get('attributes');
        var previousOwnersCount = (Object.keys(existingAttributes)
            .filter(function(k){return k.includes('Previous Owner ')}).length/3)+1;
        var newAttributes = {};
        newAttributes['Previous Owner ' + previousOwnersCount + ' Contact'] = record.get('contact');
        newAttributes['Previous Owner ' + previousOwnersCount + ' Gender'] = record.get('gender');
        newAttributes['Previous Owner ' + previousOwnersCount + ' Phone'] = record.get('phone');
        Object.assign(existingAttributes, newAttributes);
        record.set('attributes', existingAttributes);
        dialog.ownerChanged = true;
        this.callParent(arguments);
    }
});
