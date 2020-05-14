import { login, refreshAccessToken, getAccessToken, getToken } from './oauth'

const spotify = {}
const getOptions = () => ({
  headers: {
    Authorization: `Bearer ${getAccessToken()}`,
  },
})
let track_start
let playInterval

spotify.init = async () => {
  window.onSpotifyWebPlaybackSDKReady = (player) => {
    /*eslint-disable no-undef*/
    spotify.player = new Spotify.Player({
      name: 'Spotigurk',
      getOAuthToken: (callback) => {
        setTimeout(() => {
          callback(getAccessToken())
        }, 1500)
      },
      volume: 0.25,
    })

    spotify.player.on('ready', ({ device_id }) => {
      console.log('ready', device_id)
      spotify.device_id = device_id
    })

    spotify.player.on('player_state_changed', (state) => {
      console.log('state', state)
      if (state.position > 0) {
        track_start = Date.now() + state.position
      }
      spotify.device = state
    })

    // Connect to the player!
    spotify.player.connect()
  }

  let { access_token, refresh_token } = getToken()
  if (!access_token && refresh_token) {
    await refreshAccessToken()
  }
  if (!refresh_token) {
    await login()
  }
}

spotify.getTrackData = (trackId) => {
  return fetch(
    `https://api.spotify.com/v1/audio-features/${trackId}`,
    getOptions()
  )
    .then((response) => response.json())
    .then((data) => {
      return fetch(data.analysis_url, getOptions())
        .then((res) => res.json())
        .then((response) => {
          spotify.analysis = response
          console.log('response', response)
          data.analysis = response.analysis
          return data
        })
    })
}

spotify.searchArtist = (text) => {
  return fetch(
    `https://api.spotify.com/v1/search?type=artist&q=${text}`,
    getOptions()
  )
    .then((response) => response.json())
    .then((data) => {
      const artist = data.artists.items[0]
      return spotify.getArtistTopTracks(artist.href).then(({ tracks }) => {
        return {
          artist,
          tracks,
        }
      })
    })
}

spotify.getArtistTopTracks = (artistUrl) => {
  return fetch(`${artistUrl}/top-tracks?country=SE`, getOptions())
    .then((response) => response.json())
    .then((data) => {
      const track = data.tracks[0]
      spotify.playTrack(track.uri)
      return data
    })
}

spotify.playTrack = (trackId, callback) => {
  const _options = Object.assign({}, getOptions(), {
    method: 'PUT',
    body: JSON.stringify({
      uris: [trackId],
    }),
  })
  return fetch(
    `https://api.spotify.com/v1/me/player/play?device_id=${spotify.device_id}`,
    _options
  ).then(() => {
    console.log(spotify.analysis)
    clearInterval(playInterval)
    const beats = spotify.analysis.beats
    playInterval = setInterval(() => {
      const offset = Math.round((Date.now() - track_start) / 1000)
      if (beats.length && beats[0].start <= offset) {
        callback(beats.shift())
      }
    }, 5)
  })
}

export default spotify
