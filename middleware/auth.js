'use strict';

const {OAuth2Client} = require('google-auth-library');
const CLIENT_ID = "134641852092-bhqgojp2m9re1i4u38pi3o5mnr53r5f0.apps.googleusercontent.com";
const client = new OAuth2Client(CLIENT_ID);

module.exports = () => {
  return (req, res, next) => {
    if (req.url.includes('api')){
        checkAuthentication(req, res, next);
    }
    else{
        next();
    }
  };
};

function checkAuthentication(req, res,  next) {
  const bearerToken = req.headers.authorization;
  const accessToken = req.query.access_token;
  const token = bearerToken && bearerToken.split(' ').pop() || accessToken;
  if (token) {
    client.verifyIdToken({ idToken: token, audience: CLIENT_ID}, async (err, resp) => {
      if (err) {
        console.log(err)
        const error = new Error('Invalid Token');
        error.statusCode = 498;
        error.message = 'Please refresh token';
        next(error);
      } else {
          console.log(`User: ${resp.getPayload().email}`);
          req.headers['user'] = resp.getPayload();
          next();
      }
    });
  } else {
    const error = new Error('Token not found');
    error.statusCode = 417;
    error.message = 'Please log in';
    next(error);
  }
}