import React, { useEffect, useState } from 'react'
import { Spring } from 'react-spring/renderprops'

import styled from 'styled-components'
import axios from 'axios'
import moment from 'moment'

const API_URL = 'http://localhost:4000'

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
    setSlide(e.target.value)
  }
  useEffect(() => {
    const handleBeat = ({ detail }) => {
      const _min = Math.floor(max * 0.75)
      const val = Math.floor(Math.random() * (max - _min + 1)) + _min
      console.log('handleBeat', detail.duration)
      setSlide(val)
      setTimeout(() => {
        setSlide(0)
      }, (detail.duration / 2) * 1000)
    }
    window.addEventListener('beat', handleBeat)

    return () => {
      window.removeEventListener('beat', handleBeat)
    }
  }, [max])
  console.log('state', state)
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
    <Spring
      from={{ val: 0 }}
      to={{ val: sliderProps.value }}
      config={{ precision: 1 }}
    >
      {(props) => {
        const value = Math.floor(props.val)
        return (
          <ImageSlider>
            {images.length && (
              <>
                <img
                  alt="gurkbild"
                  src={`${API_URL}/${images[value].replace('/data/', '/')}`}
                ></img>
                <span>{dateForImage(images[value])}</span>
              </>
            )}
            <input {...sliderProps} value={value} />
          </ImageSlider>
        )
      }}
    </Spring>
  )
}
