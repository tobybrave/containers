import React from 'react'
import { useQuery } from '@apollo/client'
import { CURRENT_USER, ALL_BOOKS } from '../queries'

const Recommend = ({ show }) => {
  const { loading, data } = useQuery(ALL_BOOKS)
  const result = useQuery(CURRENT_USER)
   
  const recommendedBooks = () => data.allBooks.filter(({ genres }) => genres.includes(result.data.me.favoriteGenre))
  
  if (!show) return null
  if (loading) return <div>...loading</div>
  
  return(
    <div>
      <h2>recommendations</h2>
      books in your favorite genre <strong>{result.data.me.favoriteGenre}</strong>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {
            recommendedBooks().map((book) => 
              <tr key={book.title}>
                <td>{book.title}</td>
                <td>{book.author.name}</td>
                <td>{book.published}</td>
              </tr>
            )
          }
        </tbody>
      </table>
    </div>
    )
}

export default Recommend
