import React from 'react'
import { Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const Users = ({ users }) => {
  return (
    <div className='container'>
      <h4>Users</h4>
      <Table striped hover variant="dark">
        <thead>
          <tr>
            <th></th>
            <th>Blog created</th>
          </tr>
        </thead>
        <tbody>
        {
        users.map((user) =>
          <tr key={user.id}>
            <Link to={`/users/${user.id}`}>
              <td>{user.name}</td>
            </Link>
            <td>{user.blogs.length}</td>
          </tr>
        )
        }
        </tbody>
      </Table>
    </div>
  )
}

export default Users
