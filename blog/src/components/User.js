import React from 'react'
import { ListGroup } from 'react-bootstrap'

const User = ({ user }) => {
  if (!user) {
    return null
  }
  return(
    <div className='container'>
      <h4 style={{textAlign: 'center'}}>{user.name}</h4>
      <h5>added blogs</h5>
      <ListGroup variant='flush'>
      {
        user.blogs.map((blog) =>
          <ListGroup.Item key={blog.id}>
            {blog.title}
            </ListGroup.Item>
        )
      }
      </ListGroup>
    </div>
)
}

export default User
