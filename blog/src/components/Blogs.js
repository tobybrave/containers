import React from 'react'
import { Link } from 'react-router-dom'
import { ListGroup } from 'react-bootstrap'

const Blogs = ({ blog }) => {
  /*
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: '1px solid black',
    marginBottom: 5
  }
  */
  
  return (
    <div className='container'>
      <ListGroup.Item action href='#' variant="light">
        <Link to={`/blogs/${blog.id}`}>
          {blog.title} {blog.author}
        </Link>
      </ListGroup.Item>
    </div>
  )
}

export default Blogs
