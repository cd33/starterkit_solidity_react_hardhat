import React from 'react'
import * as s from '../styles/global.style'

const Counter = ({ counter, setCounter, limit=3, start=1 }) => {

  const increase = () => {
    if (counter < limit) {
      setCounter((count) => count + 1)
    }
  }
  const decrease = () => {
    if (counter > start) {
      setCounter((count) => count - 1)
    }
  }

  return (
    <s.Container fd="row" ai="center" jc="center">
      <s.ButtonCounter onClick={decrease}>-</s.ButtonCounter>
      <s.Text ff="NexaXBold" fs="3em" style={{ margin: '0 15px' }}>{counter}</s.Text>
      <s.ButtonCounter onClick={increase}>+</s.ButtonCounter>
    </s.Container>
  )
}

export default Counter