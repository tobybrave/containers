import React from 'react'
import PropTypes from 'prop-types'
import CommentSection from './CommentSection'
import { Button, Badge } from 'react-bootstrap'

const Blog = ({ blog, handleLike, handleRemove, user }) => {
  if (!blog) {
    return null
  }
  return(
    <div>
      <h3><em>{blog.title} {blog.author}</em></h3>
      <div>
        <em>{blog.url}</em><br />
        <Button variant="outline-primary" onClick={() => handleLike(blog)}>
          like <Badge variant="light">{blog.likes}</Badge>
          <span className="sr-only">likes</span>
        </Button>
        <br />
        added by <strong>{blog.user.name}</strong> <br />
        <Button variant='danger' style={{ display: user === blog.user.name ? '' : 'none' }}onClick={() => handleRemove(blog)}>
        remove
        </Button>
      </div>
      <br />
      <CommentSection
        blog={blog}
      />
    </div>
    )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  handleLike: PropTypes.func.isRequired,
  handleRemove: PropTypes.func.isRequired,
  user: PropTypes.string.isRequired
}

export default Blog
