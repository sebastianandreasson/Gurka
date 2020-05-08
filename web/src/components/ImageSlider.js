import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import axios from 'axios'
import moment from 'moment'

const API_URL = 'https://gurkapi.sebastianandreasson.com'

const ImageSlider = styled.div`
  margin: 0 auto;
  width: 800px;
  max-width: 50%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  > img {
    border-radius: 8px;
    max-width: 100%;
  }

  > input {
    margin-top: 15px;
    width: 100%;
  }

  @media (max-width: 540px) {
    max-width: 100%;
  }
`

const useSlider = (min, max, defaultState) => {
  const [state, setSlide] = useState(defaultState)
  const handleChange = (e) => {
    console.log('setting level', e.target.value)
    setSlide(e.target.value)
  }

  const props = {
    type: 'range',
    id: 'slider',
    min,
    max,
    step: 1,
    value: state,
    onChange: handleChange,
  }
  return props
}

const dateForImage = (img) => {
  // return img
  const index = img.indexOf('gurka-') + 6
  const dateString = img.slice(index, index + 25)
  return moment(dateString).format('dddd, MMMM Do YYYY, HH:mm:ss')
}

export default () => {
  const [images, setImages] = useState([])
  const sliderProps = useSlider(0, images.length - 1, 0)

  useEffect(() => {
    async function getImages() {
      const response = await axios.get(`${API_URL}/gurkor`)
      const _images = await response.data

      setImages(_images)
    }

    getImages()
  }, [])

  return (
    <ImageSlider>
      {images.length && (
        <>
          <img
            alt="gurkbild"
            src={`${API_URL}/${images[sliderProps.value].replace(
              '/data/',
              '/'
            )}`}
          ></img>
          <span>{dateForImage(images[sliderProps.value])}</span>
        </>
      )}
      <input {...sliderProps} />
    </ImageSlider>
  )
}
