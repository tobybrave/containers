const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response, next) => {
  try {
    const allBlogs = await Blog.find({})
    const result = allBlogs.length
      ? allBlogs
      : 'No blog enlisted yet!'
    response.json(result)
  } catch (error) {
    next(error)
  }
})

blogRouter.post('/', async (request, response, next) => {
  const {
    title, author, url, likes
  } = request.body
  if (!title && !url) {
    return response.status(400).json({
      error: 'title and url data is missing'
    })
  }
  try {
    const blogs = new Blog({
      title,
      author,
      url,
      likes: !likes ? 0 : likes
    })
    const savedBlog = await blogs.save()
    return response.status(201).json(savedBlog.toJSON())
  } catch (error) {
    return next(error)
  }
})
blogRouter.delete('/:id', async (request, response, next) => {
  const { id } = request.params
  try {
    const blog = await Blog.findById(id)
    if (!blog) {
      return response.status(404).json({
        error: 'blog does not exist'
      })
    }
    await Blog.findByIdAndDelete(blog.id)
    return response.status(204).end()
  } catch (error) {
    return next(error)
  }
})

module.exports = blogRouter