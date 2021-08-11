import React, { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import Select from 'react-select'
import { EDIT_AUTHOR } from '../queries'

const EditAuthor = ({ authors }) => {
  const [name, setName] = useState(null)
  const [born, setBorn] = useState('')
  
  const [ editAuthor, result ] = useMutation(EDIT_AUTHOR)
  
  useEffect(() => {
    if(result.data && result.data.editAuthor === null) {
      alert('author does not exist')
    }
  }, [result.data])
  
  const updateAuthor = (event) => {
    event.preventDefault()
    editAuthor({
      variables: {
        name: name.value,
        setBornTo: Number(born) }
    })
    
    setBorn('')
    setName(null)
  }
  
  if (!authors){
    return null
  }
  return (
    <div>
      <h2>Set Birthyear</h2>
      <form onSubmit={updateAuthor}>
        <div>
        name
          <Select 
            options={authors}
            onChange={setName}
            value={name}
	    placeholder='select author'
          />
        </div>
        <div>
        born
          <input type='number' onChange={({ target }) => setBorn(target.value)} value={born} />
        </div>
        <button>update author</button>
      </form>
    </div>
  )
}

export default EditAuthor
