import React from 'react'
import { Form, Button } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { errorNotifier } from '../reducers/notificationReducer'
import { setUser } from '../reducers/userReducer'

const Login = () => {
  const dispatch = useDispatch()

  const handleLogin = async (event) => {
    event.preventDefault()

    const username = event.target.username
    const password = event.target.password

    const credentials = {
      username: username.value,
      password: password.value
    }

    try {
      await dispatch(setUser(credentials))

      username.value = ''
      password.value = ''
    } catch (error) {
      dispatch(errorNotifier('wrong username or password'))
    }
  }

  return (
    <div className='container'>
      <h2>log in to application</h2>
      <br />
      <Form onSubmit={handleLogin}>
        <Form.Group controlId="formBasicUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control name="username" type="text" placeholder="Enter username" />
        </Form.Group>
      
        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control name="password" type="password" placeholder="Enter password" />
        </Form.Group>
        <Button variant="primary" type="submit">
          Login
        </Button>
      </Form>
    </div>
    )
}

export default Login
