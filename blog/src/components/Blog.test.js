import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Blog from './Blog'

describe('<Blog />', () => {
  let component
  const blog = {
    title: 'OOP in javascript: What you need to know',
    author: 'Richard Bovell',
    url: 'http://javascriptissexy.com/oop-in-javascript-what-you-need-to-know/',
    likes: '20',
    user: {
      name: 'Dave Dellinger'
    }
  }
  const mockLikeHandle = jest.fn()
  const mockRemoveHandle = jest.fn()

  beforeEach(() => {
    component = render(
      <Blog 
        blog={blog} 
        user='Jerry Rubin' 
        handleLike={mockLikeHandle} 
        handleRemove={mockRemoveHandle} 
      />
    )
  })

  test('Blog component renders title and author only', () => {
    const blogDetails = component.container.querySelector('.blogDetails')
    const view = component.container.querySelector('#view')

    expect(blogDetails).toHaveTextContent(`${blog.title} ${blog.author}`)
    expect(view).toHaveStyle('display: none')
  })

  test('click view button unveils the remain blog properties', () => {
    const viewButton = component.getByText('view')
    const view = component.container.querySelector('#view')
    fireEvent.click(viewButton)

    expect(view).toHaveStyle('display: block')
  })
  
  test('clicking view button twice get called twice', () => {
    const viewButton = component.getByText('view')
    fireEvent.click(viewButton)
    const likeButton = component.getByText('like')
    fireEvent.click(likeButton)
    
    const likedButton = screen.getByRole('button', {name: 'like'})
    fireEvent.click(likedButton)
    
    expect(mockLikeHandle).toHaveBeenCalledTimes(2)
  })
})
