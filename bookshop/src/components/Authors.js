import React from 'react'
import { useQuery } from '@apollo/client'
import { ALL_AUTHORS } from '../queries'
import EditAuthor from './EditAuthor'

const Authors = (props) => {
  const { loading, error, data } = useQuery(ALL_AUTHORS)
  
  if (!props.show) {
    return null
  }
  if (loading) {
    return(<div>loading...</div>)
  }
  if (error) {
    return(<div>An error occurred </div>)
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              born
            </th>
            <th>
              books
            </th>
          </tr>
          {data.allAuthors.map(a =>
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          )}
        </tbody>
      </table>
      {
        props.token
          ? <EditAuthor
                  authors={data.allAuthors.map((author) => {
                    return {
                      ...author,
                      label: author.name,
                      value: author.name
                    }
                  }
                )}/>
          : null
      }
      

    </div>
  )
}

export default Authors

