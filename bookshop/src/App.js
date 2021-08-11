import React, { useState, useEffect } from 'react'
import { useApolloClient } from '@apollo/client'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Login from './components/Login'
import Notification from './components/Notification'
import Recommend from './components/Recommend'

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const [error, setError] = useState(null)
  
  const client = useApolloClient()
  
  useEffect(() => {
    const libraryUser= localStorage.getItem('user-library-token')
    setToken(libraryUser)
  }, [])
  
  const handleLogout = () => {
    setToken(null)
    localStorage.removeItem('user-library-token')
    client.resetStore()
    setPage('login')
  }
  
  return (
    <div>
      <Notification message={error} />
      <div>
        <button onClick={() => setPage  ('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {
          token 
          ? <>
              <button onClick={() => setPage('add')}>add book</button>
              <button onClick={() => setPage('recommend')}>recommend</button>
              <button onClick = { handleLogout } > logout </button>
            </>
          : <button onClick={() => setPage('login')}>login</button>
        }
        
      </div>

      <Authors
        show={page === 'authors'}
        token={token}
	setError={setError}
      />

      <Books
        show={page === 'books'}
      />

      <NewBook
        show={page === 'add'}
      />
      
      <Login
        show={page === 'login'}
        setToken={setToken}
        setError={setError}
	setPage={setPage}
      />
      
      <Recommend 
        show={page === 'recommend'}
      />

    </div>
  )
}

export default App

