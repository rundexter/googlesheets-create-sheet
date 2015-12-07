var _ = require('lodash'),
    google = require('googleapis'),
    OAuth2 = google.auth.OAuth2;

var pickData = ['id', 'title', 'defaultOpenWithLink'];
var mimeType = 'application/vnd.google-apps.spreadsheet';

module.exports = {
    checkAuthOptions: function (step, dexter) {

        if(!step.input('name').first()) {

            this.fail('A [name] input variable is required for this module');
        }

        if(!dexter.environment('google_access_token')) {

            this.fail('A google_access_token environment variable is required for this module');
        }
    },

    /**
     * The main entry point for the Dexter module
     *
     * @param {AppStep} step Accessor for the configuration for the step using this module.  Use step.input('{key}') to retrieve input data.
     * @param {AppData} dexter Container for all data used in this workflow.
     */
    run: function(step, dexter) {

        this.checkAuthOptions(step, dexter);

        var oauth2Client = new OAuth2();
        var service = google.drive('v2');

        oauth2Client.setCredentials({access_token: dexter.environment('google_access_token'), refresh_token: dexter.environment('google_refresh_token')});
        google.options({ auth: oauth2Client });

        service.files.insert({
            convert: true,
            resource: {
                    title: step.input('name').first(),
                    mimeType:mimeType
                }
        }, function (err, data) {

            err? this.fail(err) : this.complete(_.pick(data, pickData));
        }.bind(this));
    }
};
