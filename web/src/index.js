import React from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import Months from './components/Months'
import ImageSlider from './components/ImageSlider'
import spotify from './adapters/spotify'

spotify.init().then(() => {
  console.log('spotifyInited')

  setTimeout(async () => {
    await spotify.getTrackData('247OK7W7ke06iripfvHDiw')
    // await spotify.playTrack('spotify:track:247OK7W7ke06iripfvHDiw', (beat) => {
    //   const event = new CustomEvent('beat', { detail: beat })
    //   window.dispatchEvent(event)
    // })
  }, 5000)
})

const Container = styled.div`
  margin: 0 auto;
  width: 80%;

  @media (max-width: 540px) {
    width: 95%;
  }
`

const Title = styled.h1`
  text-align: center;
`

const App = () => {
  return (
    <Container>
      <Title>🥒 Gurkor 🥒</Title>
      <ImageSlider />
      <br></br>
      <br></br>
      <Title>🥒 Varje dag 🥒</Title>
      <Months />
    </Container>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
