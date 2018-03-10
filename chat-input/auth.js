const GoogleAuth = require('google-auth-library');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

function authorize() {
    return new Promise(resolve => {
        const authFactory = new GoogleAuth.GoogleAuth();
        const jwtClient = new GoogleAuth.JWT(
            process.env.GOOGLE_CLIENT_EMAIL,
            null,
            process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'), 
            SCOPES
        );

        jwtClient.authorize(() => resolve(jwtClient));
    });
}

module.exports = {
    authorize,
}