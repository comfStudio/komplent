import querystring from 'querystring'
import url from 'url'
import { google } from 'googleapis'
import uuid from 'uuid'
import redirect from 'micro-redirect'

const provider = 'google';
const {OAuth2} = google.auth

const getToken = (oauth2Client, code) => new Promise((resolve, reject) => {
  oauth2Client.getToken(code, (err, tokens) => {
    if (err) return reject(err)

    oauth2Client.setCredentials(tokens)

    resolve(tokens)
  })
})

const getUser = async (oauth2Client, personFields) => {
    const people = google.people({
        version: 'v1',
        auth: oauth2Client,
      });
    return (await people.people.get({
        resourceName: 'people/me',
        personFields
      })).data
}

export default ({
  clientId,
  clientSecret,
  callbackUrl,
  path,
  scopes = [],
  personFields = 'emailAddresses,names,photos',
  accessType = 'offline'
}) => {
  const states = [];
  const oauth2Client = new OAuth2(clientId, clientSecret, callbackUrl)

  return fn => async (req, res, ...args) => {
    const {pathname, query} = url.parse(req.url)

    if (pathname === path) {
      try {
        const state = uuid.v4()
        states.push(state)

        const redirectUrl = oauth2Client.generateAuthUrl({
          // eslint-disable-next-line camelcase
          access_type: accessType,
          scope: scopes,
          state
        })

        return redirect(res, 302, redirectUrl)
      } catch (err) {
        args.push({err, provider})
        return fn(req, res, ...args)
      }
    }

    const callbackPath = url.parse(callbackUrl).pathname
    if (pathname === callbackPath) {
      try {
        const {state, code} = querystring.parse(query)

        if (!states.includes(state)) {
          const err = new Error('Invalid state')
          args.push({err, provider})
          return fn(req, res, ...args)
        }

        states.splice(states.indexOf(state), 1)

        const tokens = await getToken(oauth2Client, code)

        if (tokens.error) {
          args.push({err: tokens.error, provider});
          return fn(req, res, ...args);
        }

        const user = await getUser(oauth2Client, personFields)
        const result = {
          provider,
          accessToken: tokens.access_token,
          info: user,
          tokens
        }

        args.push({result})

        return fn(req, res, ...args)
      } catch (err) {
        args.push({err, provider})
        return fn(req, res, ...args)
      }
    }

    return fn(req, res, ...args)
  }
}
