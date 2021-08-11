import React from 'react'
import { Col, Button, Form, Row, Card } from 'react-bootstrap'

const BlogForm = ({ createBlog }) => {
  const addBlog = (event) => {
    event.preventDefault()

    let title = event.target.title
    let author = event.target.author
    let url = event.target.url

    createBlog({
      title: title.value,
      author: author.value,
      url: url.value
    })

    title.value = ''
    author.value = ''
    url.value = ''
  }

  return (
    <Card style={{backgroundColor: '#e0b0ff'}}>
      <Card.Body>
      <Card.Title>Create Blog</Card.Title>
      <Card.Subtitle className="mb-2 text-muted">add your fave blog :)</Card.Subtitle>
      <Form onSubmit={addBlog}>
        <Form.Group as={Row} controlId="formHorizontalText" >
          <Form.Label column sm={2}>
            title
          </Form.Label>
          <Col sm={10}>
            <Form.Control type="text" name="title" placeholder="Enter blog title" />
          </Col>
        </Form.Group>
        <Form.Group as={Row} controlId="formHorizontalText">
          <Form.Label column sm={2}>
            author
          </Form.Label>
          <Col sm={10}>
            <Form.Control type="text" name="author" placeholder="Enter blog author" />
          </Col>
        </Form.Group>
        <Form.Group as={Row} controlId="formHorizontalText">
          <Form.Label column sm={2}>
            url
          </Form.Label>
          <Col sm={10}>
            <Form.Control type="url" name="url" placeholder="Enter blog url" />
          </Col>
        </Form.Group>
        <Button variant="primary" type="submit">
        create!
        </Button>
      </Form>
      
      </Card.Body>
    </Card>
  )
}

export default BlogForm
