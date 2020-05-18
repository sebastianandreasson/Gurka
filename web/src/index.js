import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import Months from './components/Months'
import ImageSlider from './components/ImageSlider'
import spotify from './adapters/spotify'
import Snow from './components/Snow'
import axios from 'axios'

spotify.init().then(() => {
  setTimeout(async () => {
    await spotify.getTrackData('24PqR040n1lcb5xygrgTMz')
    await spotify.playTrack('spotify:track:24PqR040n1lcb5xygrgTMz', (beat) => {
      const event = new CustomEvent('beat', { detail: beat })
      window.dispatchEvent(event)
    })
  }, 5000)
})

const API_URL = 'http://localhost:4000'

const Container = styled.div`
  margin: 0 auto;
  width: 90%;

  @media (max-width: 540px) {
    width: 95%;
  }
`

const Title = styled.h1`
  text-align: center;
`

const App = () => {
  const [images, setImages] = useState([])
  useEffect(() => {
    async function getImages() {
      const response = await axios.get(`${API_URL}/gurkor`)
      const _images = await response.data

      setImages(_images)
    }

    getImages()
  }, [])

  return (
    <Container>
      <Title role="img" aria-label="Gurkor">
        🥒 Gurkor 🥒
      </Title>
      {images.length > 0 ? (
        <ImageSlider images={images} />
      ) : (
        'Laddar in gurkor...'
      )}
      <br></br>
      <br></br>
      <Title>🥒 Varje dag 🥒</Title>
      <Months />
      <Snow />
    </Container>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
