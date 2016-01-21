var _ = require('lodash'),
    google = require('googleapis'),
    service = google.drive('v2');

var pickData = ['id', 'title', 'defaultOpenWithLink'];
var mimeType = 'application/vnd.google-apps.spreadsheet';

module.exports = {
    checkAuthOptions: function (step, dexter) {

        if(!step.input('name').first())
            return 'A [name] input variable is required for this module';

        return false;
    },

    /**
     * The main entry point for the Dexter module
     *
     * @param {AppStep} step Accessor for the configuration for the step using this module.  Use step.input('{key}') to retrieve input data.
     * @param {AppData} dexter Container for all data used in this workflow.
     */
    run: function(step, dexter) {
        var OAuth2 = google.auth.OAuth2,
            oauth2Client = new OAuth2(),
            credentials = dexter.provider('google').credentials(),
            error = this.checkAuthOptions(step, dexter);

        if (error)
            return this.fail(error);

        // set credential
        oauth2Client.setCredentials({
            access_token: _.get(credentials, 'access_token')
        });
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
