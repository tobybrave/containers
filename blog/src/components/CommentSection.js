import React, { useState } from 'react'
import { Button, Form, ListGroup, Col, Row } from 'react-bootstrap'
import blogServices from '../services/blogs'

const CommentSection = ({ blog }) => {
  const [comment, setComment] = useState('')

  const addComment = async (event) => {
    event.preventDefault()
    const content = { comment }
    await blogServices.createComment(content, blog.id)
    setComment('')
  }

  return(
    <div>
      <h4>comments</h4>
      <Form onSubmit={addComment}>
        <Form.Group as={Row} controlId="formHorizontalText" >
          <Col sm={7}>
            <Form.Control type="text" value={comment} onChange={(event) => setComment(event.target.value)} />
          </Col>
	  <Col sm={3}>
          <Button disabled={!comment} variant="outline-primary">
          add comment
          </Button>{' '}
	  </Col>
        </Form.Group>
      </Form>
      <ListGroup style={{backgroundColor: '#e0b0ff'}} variant="flush">
      {
        blog.comments.map(({ id, comment }) => <ListGroup.Item key={id}>{comment}</ListGroup.Item>)
      }
      </ListGroup>
    </div>
    )
}

export default CommentSection
