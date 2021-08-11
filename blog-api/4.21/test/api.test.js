const supertest = require('supertest')
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/users')
const {
  blogsList, blogsInDb, usersInDb
} = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  const blogs = blogsList.map((blog) => new Blog(blog))
  const blogsPromise = blogs.map((blog) => blog.save())
  await Promise.all(blogsPromise)
})

describe('GET:/api/blogs', () => {
  test('blogs are returned in json format', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('total amount of blogs is returned', async () => {
    const result = await api.get('/api/blogs')
    expect(result.body).toHaveLength(blogsList.length)
  })

  test('verify id property is defined', async () => {
    const result = await api.get('/api/blogs')
    result.body.forEach((blog) => expect(blog.id).toBeDefined())
  })
})

describe('POST:/api/blogs', () => {
  test('new blog is saved', async () => {
    const beforeSavingNewBlog = await blogsInDb()
    const newBlog = {
      author: 'Estefania Cassingena Navone',
      title: 'Dijkstra\'s Shortest Path Algorithm - A Detailed and Visual Introduction',
      url: 'https://www.freecodecamp.org/news/dijkstras-shortest-path-algorithm-visual-introduction/',
      likes: 15
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
    const afterSavingNewBlog = await blogsInDb()
    const titles = afterSavingNewBlog.map((blog) => blog.title)

    expect(afterSavingNewBlog).toHaveLength(beforeSavingNewBlog.length + 1)
    expect(titles).toContain(newBlog.title)
  })

  test('default is zero when no likes is given', async () => {
    const newBlogWithoutLikes = {
      author: 'Estefania Cassingena Navone',
      title: 'Dijkstra\'s Shortest Path Algorithm - A Detailed and Visual Introduction',
      url: 'https://www.freecodecamp.org/news/dijkstras-shortest-path-algorithm-visual-introduction/'
    }
    await api
      .post('/api/blogs')
      .send(newBlogWithoutLikes)
      .expect(201)

    const allBlogs = await blogsInDb()
    const newUserLikes = allBlogs[allBlogs.length - 1].likes
    expect(newUserLikes).toBe(0)
  })

  test('returns status code 400 when url and title is missing in data', async () => {
    const newBlogWithoutUrlAndTitle = {
      author: 'Estefania Cassingena Navone',
      likes: 15
    }
    await api
      .post('/api/blogs')
      .send(newBlogWithoutUrlAndTitle)
      .expect(400)
  })
})

describe('DELETE: /api/blogs/:id', () => {
  test('deleting a specific blog by its id', async () => {
    const beforeDeletingBlog = await Blog.find({})
    const blog = {
      _id: '5a422ba71b54a676234d17fb',
      title: 'TDD harms architecture',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
      likes: 0
    }
    await api
      .delete(`/api/blogs/${blog._id}`)
      .expect(204)
    const afterDeletingBlog = await Blog.find({})
    expect(afterDeletingBlog).toHaveLength(beforeDeletingBlog.length - 1)
    expect(afterDeletingBlog).not.toContainEqual(blog.id)
  })

  test('returns status 404 code when blog id does not exist or has been removed', async () => {
    const blog = {
      _id: '5a422ba71b54a676234d17fb',
      title: 'TDD harms architecture',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
      likes: 0
    }
    await api
      .delete(`/api/blogs/${blog._id}`)
      .expect(204)
    await api
      .delete(`/api/blogs/${blog._id}`)
      .expect(404)
  })

  test('when blog id format is invalid 400 status code is returned', async () => {
    await api
      .delete('/api/blogs/an_invalid_id_890')
      .expect(400)
  })
})

describe('PUT: /api/blogs/:id', () => {
  test('update likes of a specific blog', async () => {
    const beforeUpdatingBlog = await blogsInDb()
    const blogToUpdate = {
      ...beforeUpdatingBlog[0].toJSON(),
      likes: 8
    }
    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send({ likes: blogToUpdate.likes })
      .expect('Content-Type', /application\/json/)
    const afterUpdatingBlog = await blogsInDb()
    expect(afterUpdatingBlog).toHaveLength(beforeUpdatingBlog.length)
    expect(afterUpdatingBlog[0].likes).toBe(blogToUpdate.likes)
    expect(afterUpdatingBlog[0].toJSON()).toEqual(blogToUpdate)
  })

  test('updating likes of an invalid id throws an error with status code 404', async () => {
    await api
      .put('/api/blogs/5fc2556a4d60381d0f055dc1')
      .send({ likes: 23 })
      .expect(404)
  })
})

describe('POST: /api/users', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('bobbybboh', 10)
    const users = new User({
      passwordHash,
      username: 'bobby',
      name: 'Dave Dellinger'
    })
    await users.save()
  })

  test('new user is saved', async () => {
    const beforeAddingUser = await usersInDb()
    const newUser = {
      username: 'tobybrave',
      password: 'areallylongpassword:)',
      name: 'Toby Brave'
    }
    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const afterAddingUser = await usersInDb()
    const usernames = afterAddingUser.map(({ username }) => username)
    expect(afterAddingUser).toHaveLength(beforeAddingUser.length + 1)
    expect(afterAddingUser.map(({ username }) => username)).toContain(newUser.username)
  })

  test('Invalid users are not created and returns status code 400', async () => {
    const beforeAddingUser = await usersInDb()
    const invalidUser = {
      name: 'Oxlade'
    }
    const response = await api
      .post('/api/users')
      .send(invalidUser)
      .expect(400)
    const afterAddingUser = await usersInDb()

    expect(afterAddingUser).toHaveLength(beforeAddingUser.length)
    expect(response.body.error).toBe('Invalid username or password')
  })

  test('username and password lower than 3 characters are not created and 400 status code returned', async () => {
    const userWithLesserCharString = {
      username: 'ox',
      password: 'us',
      name: 'Oxlade Austin'
    }
    const response = await api
      .post('/api/users')
      .send(userWithLesserCharString)
      .expect(400)

    expect(response.body.error).toBe('Password should be at least 3 characters long')
  })

  test('when username already exist', async () => {
    const response = await api
      .post('/api/users')
      .send({
        username: 'bobby',
        password: 'PRIVATE',
        name: 'Bobby Seal'
      })
      .expect(400)
    expect(response.body.error).toContain('Error, expected `username` to be unique')
  })
})

afterAll(() => {
  mongoose.connection.close()
})