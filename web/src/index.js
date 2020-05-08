import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import axios from 'axios'

const API_URL = 'https://gurkapi.sebastianandreasson.com'

const Container = styled.div`
  margin: 0 auto;
  width: 80%;

  @media (max-width: 540px) {
    width: 95%;
  }
`

const Title = styled.h1`
  @media (max-width: 540px) {
    text-align: center;
  }
`

const ImageList = styled.div`
  display: flex;
  flex-wrap: wrap;
`

const Image = styled.div`
  margin: 15px;
  display: flex;
  flex-direction: column;

  @media (max-width: 540px) {
    margin: 0;
  }

  > span {
    width: 100%;
    padding: 5px;
    font-size: 24px;
    font-weight: bold;
    text-align: center;
  }

  > img {
    border-radius: 8px;
    max-width: 100%;
    width: 480px;
  }
`

const sliceName = (fileName) => {
  return fileName.replace('/data/gifs/', '').replace('.gif', '')
}

const App = () => {
  const [images, setImages] = useState([])

  useEffect(() => {
    async function getImages() {
      const response = await axios.get(`${API_URL}/gifs`)
      const _images = await response.data

      setImages(_images)
    }

    getImages()
  }, [])
  return (
    <Container>
      <Title>🥒 Gurkor 🥒</Title>
      <ImageList>
        {images.map((img) => (
          <Image>
            <span>{sliceName(img)}</span>
            <img src={`${API_URL}${img}`}></img>
          </Image>
        ))}
      </ImageList>
    </Container>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
