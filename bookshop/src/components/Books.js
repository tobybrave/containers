import React, { useState } from 'react'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS} from '../queries'

const Books = ({ show }) => {
  const [genre, setGenre] = useState(null)
  const { loading, data } = useQuery(ALL_BOOKS)
  
  const booksByGenre = () => {
    if (genre) {
      return data.allBooks.filter(({ genres }) => genres.includes(genre))
    }
    return data.allBooks
  }
  
  const booksGenre = () => {
    const genres = []
      const genresArr = [].concat(...data.allBooks.map(({ genres }) => genres))
      genresArr.forEach((genreName) => {
        if (genres.indexOf(genreName) === -1) {
          genres.push(genreName)
	}
      })
      return genres
  }
  
  
  if (!show) return null
  if (loading) return <div>loading...</div>
  
  return(
    <div>
      <h2>books</h2>
      in genres {genre ? genre : 'all genres'}
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {
            booksByGenre().map((book) => 
            <tr key={book.title}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
            )
          }
        </tbody>
      </table>
      {
        booksGenre().map((name) => 
        <button key={name} onClick={() => setGenre(name)}>
        {name}
        </button>
        )
      }
      <button onClick={() => setGenre(null)}>all genres</button>
    </div>
    )
}

export default Books
