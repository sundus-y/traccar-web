Ext.define('Traccar.view.dialog.SendGovEmailConfirmController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.sendGovEmailConfirm',

    onVerificationTextChange: function(field, val) {
        var verificationText = ["send email", "sendemail"];
        var verificationRegex = new RegExp(verificationText.join('|'), 'i');
        if (verificationRegex.test(val)) {
            this.getView().lookupReference('sendButton').setDisabled(false);
        } else {
            this.getView().lookupReference('sendButton').setDisabled(true);
        }
    },

    onSendClick: function () {
        var self = this;
        this.getView().verifyed = true;
        self.getView().hide();
    }
});
