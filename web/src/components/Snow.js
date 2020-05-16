import React from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'

const SnowFlakes = styled.div``

const SnowFlake = styled.div`
  color: #fff;
  font-size: 3em;
  font-family: Arial;
  text-shadow: 0 0 1px #000;

  position: fixed;
  top: -10%;
  z-index: -1;
  user-select: none;
  cursor: default;
  animation-name: snowflakes-fall, snowflakes-shake;
  animation-duration: 10s, 3s;
  animation-timing-function: linear, ease-in-out;
  animation-iteration-count: infinite, infinite;
  animation-play-state: running, running;

  ${({ index }) => `
    left: ${2.5 * index}%;
    animation-delay: ${Math.random() * 15}s, 0s;
  `}

  @-webkit-keyframes snowflakes-fall {
    0% {
      top: -10%;
    }
    100% {
      top: 100%;
    }
  }
  @-webkit-keyframes snowflakes-shake {
    0% {
      transform: translateX(0px);
    }
    50% {
      transform: translateX(80px);
    }
    100% {
      transform: translateX(0px);
    }
  }
  @keyframes snowflakes-fall {
    0% {
      top: -10%;
    }
    100% {
      top: 100%;
    }
  }
  @keyframes snowflakes-shake {
    0% {
      transform: translateX(0px);
    }
    50% {
      transform: translateX(80px);
    }
    100% {
      transform: translateX(0px);
    }
  }
`

export default () => {
  return (
    <SnowFlakes aria-hidden="true">
      {[
        Array.from({ length: 40 }).map((_, i) => (
          <SnowFlake key={`SnowFlake_${i}`} index={i}>
            <span role="img" aria-label="snögurka">
              🥒
            </span>
          </SnowFlake>
        )),
      ]}
    </SnowFlakes>
  )
}
