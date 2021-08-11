import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './BlogForm'

test('BlogForm props', () => {
  const blog = {
    title: 'OOP in javascript: What you need to know',
    author: 'Richard Bovell',
    url: 'http://javascriptissexy.com/oop-in-javascript-what-you-need-to-know/',
    likes: '20',
    user: {
      name: 'Dave Dellinger'
    }
  }
  const mockCreateBlog = jest.fn()
  const component = render(<BlogForm createBlog={mockCreateBlog} />)
  
  const title = component.container.querySelector('#title')
  const author = component.container.querySelector('#author')
  const url = component.container.querySelector('#Url')
  
  fireEvent.change(title, {
    target: { value: blog.title}
  })
  fireEvent.change(author, {
    target: { value: blog.author}
  })
  fireEvent.change(url, {
    target: { value: blog.url}
  })
  
  const createButton = component.getByText('create')
  fireEvent.click(createButton)
  expect(mockCreateBlog).toHaveBeenCalledTimes(1)
  expect(mockCreateBlog.mock.calls[0][0].title).toBe('OOP in javascript: What you need to know')
  expect(mockCreateBlog.mock.calls[0][0].author).toEqual('Richard Bovell')
  expect(mockCreateBlog.mock.calls[0][0].url).toBe('http://javascriptissexy.com/oop-in-javascript-what-you-need-to-know/')
})
