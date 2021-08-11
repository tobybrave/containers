import React from 'react'

const Notification = ({ message }) => {
  if (!message) {
    return null
  }
  
  return(
    <div 
      style={{
      color: 'red',
      padding: '5px',
      borderRadius: '5px',
      backgroundColor: 'lightgrey',
      border: '2px solid red'
      }}
    >
      {message}
    </div>
    )
}

export default Notification
