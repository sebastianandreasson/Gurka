import React from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import Months from './components/Months'
import ImageSlider from './components/ImageSlider'

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
