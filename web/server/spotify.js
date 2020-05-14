const request = require('request-promise-native')
const querystring = require('querystring')

const client_id = process.env.CLIENT_ID
const client_secret = process.env.CLIENT_SECRET
const redirect_uri = `${process.env.API_HOST}/spotify/callback`
const stateKey = 'spotify_auth_state'

const generateRandomString = (length) => {
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  return Array.from({ length })
    .map((_) => possible.charAt(Math.floor(Math.random() * possible.length)))
    .join('')
}

const getReqOptions = () => {
  const buffer = new Buffer(client_id + ':' + client_secret)
  return {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      Authorization: `Basic ${buffer.toString('base64')}`,
    },
    json: true,
  }
}

module.exports = (app) => {
  app.get('/spotify/login', (req, res) => {
    const state = generateRandomString(16)
    console.log('login.state', state)
    res.cookie(stateKey, state)

    // your application requests authorization
    const scope =
      'user-read-private user-read-email app-remote-control user-read-playback-state user-modify-playback-state streaming'
    res.redirect(
      'https://accounts.spotify.com/authorize?' +
        querystring.stringify({
          response_type: 'code',
          client_id,
          scope,
          redirect_uri,
          state,
        })
    )
  })

  app.get('/spotify/callback', (req, res) => {
    const code = req.query.code || null
    const state = req.query.state || null
    const storedState = req.cookies ? req.cookies[stateKey] : null

    if (state === null || state !== storedState) {
      return res.redirect(
        '/#' +
          querystring.stringify({
            error: 'state_mismatch',
          })
      )
    }
    res.clearCookie(stateKey)
    const options = {
      form: {
        code,
        redirect_uri,
        grant_type: 'authorization_code',
      },
      ...getReqOptions(),
    }

    request
      .post(options)
      .then((body) => {
        const { access_token, refresh_token, expires_in } = body
        console.log('access_token', access_token)

        // we can also pass the token to the browser to make requests from there
        res.cookie('refresh_token', refresh_token, {
          maxAge: 30 * 24 * 3600 * 1000,
          domain: 'localhost',
        })
        return res.render('callback', {
          access_token,
          refresh_token,
          expires_in,
        })
      })
      .catch((_) => {
        res.redirect(
          '/#' +
            querystring.stringify({
              error: 'invalid_token',
            })
        )
      })
  })

  app.get('/spotify/refresh_token', (req, res) => {
    // requesting access token from refresh token
    const refresh_token = req.query.refresh_token
    const options = {
      form: {
        grant_type: 'refresh_token',
        refresh_token,
      },
      ...getReqOptions(),
    }

    request
      .post(options)
      .then((body) => {
        const { access_token, expires_in } = body
        res.send({
          access_token,
          expires_in,
        })
      })
      .catch((err) => {
        console.log(err)
      })
  })
}
