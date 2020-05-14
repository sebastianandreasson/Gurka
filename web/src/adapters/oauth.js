const tokenExpired = (expires) => {
  const now = new Date().getTime()
  return now > parseInt(expires)
}

export const refreshAccessToken = () => {
  const { refresh_token } = getToken()
  fetch(
    `http://localhost:4000/spotify/refresh_token?refresh_token=${refresh_token}`
  )
    .then((res) => res.json())
    .then(({ access_token, expires_in }) => {
      updateToken({
        access_token,
        expires_in,
        refresh_token,
      })
    })
}

export const login = () => {
  return new Promise((resolve, reject) => {
    const width = 450,
      height = 730,
      left = window.screen.width / 2 - width / 2,
      top = window.screen.height / 2 - height / 2

    window.addEventListener(
      'message',
      (event) => {
        console.log('event', event)
        let hash
        try {
          hash = event.data ? JSON.parse(event.data) : {}
        } catch (e) {}
        if (hash && hash.type == 'access_token') {
          if (hash.access_token === '') {
            clearToken()
            return reject()
          }
          updateToken(hash)
          resolve(hash.access_token)
        }
      },
      false
    )

    const w = window.open(
      'http://localhost:4000/spotify/login',
      'Spotify',
      'menubar=no,location=no,resizable=no,scrollbars=no,status=no, width=' +
        width +
        ', height=' +
        height +
        ', top=' +
        top +
        ', left=' +
        left
    )
  })
}

export const updateToken = ({ access_token, expires_in, refresh_token }) => {
  const now = new Date()
  const expires = new Date(now.getTime() + expires_in * 1000)

  localStorage.setItem('access_token', access_token)
  localStorage.setItem('refresh_token', refresh_token)
  localStorage.setItem('expires', expires.getTime())
}

export const clearToken = () => {
  localStorage.setItem('access_token', null)
  localStorage.setItem('refresh_token', null)
  localStorage.setItem('expires', null)
}

export const getToken = () => {
  const access_token = localStorage.getItem('access_token')
  const refresh_token = localStorage.getItem('refresh_token')
  const expires = localStorage.getItem('expires')
  console.log({ access_token, refresh_token, expires })
  if (access_token && !tokenExpired(expires)) {
    return {
      access_token,
      expires,
      refresh_token,
    }
  }
  return {
    refresh_token,
  }
}

export const getAccessToken = () => {
  return getToken() ? getToken().access_token : null
}
