import compose from 'micro-compose'
import { NOT_FOUND, FORBIDDEN } from 'http-status-codes'
import { NextApiRequest, NextApiResponse } from 'next'
import CONFIG from '@server/config'

import microAuthFacebook from 'microauth-facebook'
import microAuthTwitter from 'microauth-twitter'
import microAuthGoogle from 'microauth-google'

const twitterOptions = {
  clientId: 'client_id',
  clientSecret: 'client_secret',
  callbackUrl: 'http://localhost:3000/auth/slack/callback',
  path: '/api/auth/twitter',
  scope: 'identity.basic,identity.team,identity.avatar'
};

const facebookOptions = {
    clientId: 'client_id',
    clientSecret: 'client_secret',
    callbackUrl: 'http://localhost:3000/auth/slack/callback',
    path: '/api/auth/facebook',
    scope: 'identity.basic,identity.team,identity.avatar'
  };

const googleOptions = {
    clientId: CONFIG.GOOGLE_CLIENT_ID,
    clientSecret: CONFIG.GOOGLE_CLIENT_SECRET,
    callbackUrl: 'http://localhost:3500/api/auth/google/callback',
    path: '/api/auth/google',
    scope: 'https://www.googleapis.com/auth/userinfo.profile'
  };

const facebookAuth = microAuthFacebook(facebookOptions);
const googleAuth = microAuthGoogle(googleOptions);
const twitterAuth = microAuthTwitter(twitterOptions);

const handler = async (req: NextApiRequest, res: NextApiResponse, auth) => {

    console.log(auth)

    if (!auth) {
        return res.status(NOT_FOUND).send('Not Found')
    }

    if (auth.err) {
        console.error(auth.err);
        return res.status(FORBIDDEN).send('Forbidden')
    }

    if (auth.result.provider === 'github') {
        return `${auth.result.provider} provider. Hello ${auth.result.info.login}`;
    } else if (auth.result.provider === 'slack') {
        return `${auth.result.provider} provider. Hello ${auth.result.info.user.name}`;
    } else {
        return 'Unknown provider';
    }

};

export default compose(
    facebookAuth,
    googleAuth,
    twitterAuth
)(handler);