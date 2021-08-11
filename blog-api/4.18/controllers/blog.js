const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/users')

blogRouter.get('/', async (request, response, next) => {
  const allBlogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  const result = allBlogs.length
    ? allBlogs
    : 'No blog enlisted yet!'
  response.json(result)
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
  const user = await User.findOne({ username: 'bobby' })
  const blogs = new Blog({
    title,
    author,
    url,
    likes: !likes ? 0 : likes,
    user: user._id
  })
  const savedBlog = await blogs.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  return response.status(201).json(savedBlog.toJSON())
})

blogRouter.delete('/:id', async (request, response, next) => {
  const { id } = request.params
  const blog = await Blog.findById(id)
  if (!blog) {
    return response.status(404).json({
      error: 'blog does not exist'
    })
  }
  await Blog.findByIdAndDelete(blog.id)
  return response.status(204).end()
})

blogRouter.put('/:id', async (request, response, next) => {
  const { id } = request.params
  const { likes } = request.body
  const blog = await Blog.findById(id)
  if (!blog) {
    return response.status(404).json({
      error: 'blog does not exist'
    })
  }
  const updatedBlog = await Blog.findByIdAndUpdate(blog.id, { likes }, { new: true })
  return response.status(202).json(updatedBlog.toJSON())
})

module.exports = blogRouter