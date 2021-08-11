import React, { useState, useImperativeHandle } from 'react'
import { Button } from 'react-bootstrap'

const Togglable = React.forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false)

  const hideVisibility = {
    display: visible ? 'none' : ''
  }
  const showVisibility = {
    display: visible ? '' : 'none'
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(ref, () => {
    return {
      toggleVisibility
    }
  })

  return(
    <div>
      <div style={hideVisibility}>
        <Button variant='outline-primary' onClick={toggleVisibility}>{props.buttonLabel}</Button>
      </div>
      <div style={showVisibility}>
        {props.children}
        <Button variant='outline-danger' onClick={toggleVisibility}>cancel</Button>
      </div>
    </div>
  )
})

Togglable.displayName = 'Togglable'
export default Togglable
