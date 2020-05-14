import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import axios from 'axios'

const API_URL = 'http://localhost:4000'

const ImageList = styled.div`
  display: flex;
  flex-wrap: wrap;
`

const Gif = styled.div`
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

export default () => {
  const [gifs, setGifs] = useState([])

  useEffect(() => {
    async function getGifs() {
      const response = await axios.get(`${API_URL}/gifs`)
      const _gifs = await response.data

      setGifs(_gifs)
    }

    getGifs()
  }, [])

  return (
    <ImageList>
      {gifs.map((gif) => (
        <Gif>
          <span>{sliceName(gif)}</span>
          <img alt="gurkgif" src={`${API_URL}${gif}`}></img>
        </Gif>
      ))}
    </ImageList>
  )
}
