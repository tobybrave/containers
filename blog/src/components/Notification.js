import React from 'react'
import { useSelector } from 'react-redux'
import { Alert } from 'react-bootstrap'

const Notification = () => {
  const notification = useSelector((state) => state.notification)
  if (notification) {
    return(
      <Alert variant={notification.success ? 'success' : 'danger'}>
        {notification.message}
      </Alert>
    )
  }
  return null
}

export default Notification
