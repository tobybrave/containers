import React, { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { LOGIN } from '../queries'

const Login = ({ show, setToken, setError, setPage }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [ login, { data } ] = useMutation(LOGIN, {
    onError: (error) => {
      setError(error.graphQLErrors[0].message)
      setTimeout(() => setError(null), 10000)
    }
  })
  
  useEffect(() => {
    if (data) {
      setToken(data.login.value)
      localStorage.setItem('user-library-token', data.login.value)
      setPage('authors')
    }
  }, [data]) // eslint-disable-line
  
  if (!show) {
    return null
  }
  
  const handleLogin = async (event) => {
    event.preventDefault()
    
    await login({ variables: { username, password } })
    
    setUsername('')
    setPassword('')
  }
  
  return(
    <form onSubmit={handleLogin}>
      <div>
      username
        <input value={username} onChange={({ target }) => setUsername(target.value)} />
      </div>
      <div>
      password
        <input type='password' value={password} onChange={({ target }) => setPassword(target.value)} />
      </div>
      <button>login</button>
    </form>
    )
}

export default Login
