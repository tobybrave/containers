const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const Blog = require('../models/blog')
const { blogsList, blogsInDb } = require('./test_helper')
const {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
} = require('../utils/list_helper')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  const blogs = blogsList.map((blog) => new Blog(blog))
  const blogsPromise = blogs.map((blog) => blog.save())
  await Promise.all(blogsPromise)
})

test('dummy returns one', () => {
  expect(dummy([])).toBe(1)
})

describe('total likes', () => {
  test('of empty list is zero', () => {
    expect(totalLikes([])).toBe(0)
  })
  test('when list has one blog, equals to likes of that', () => {
    expect(totalLikes([blogsList[0].likes])).toBe(7)
  })
  test('of a bigger list is calculated right', () => {
    const likes = blogsList.map((blog) => blog.likes)
    expect(totalLikes(likes)).toBe(36)
  })
})

describe('favorite blog', () => {
  test('when no blog details is provided', () => {
    expect(favoriteBlog([])).toEqual({})
  })
  test('when only one blog detail is provided, it outputs itself', () => {
    expect(favoriteBlog([blogsList[4]])).toEqual({
      title: 'TDD harms architecture',
      author: 'Robert C. Martin',
      likes: 0
    })
  })

  test('when numerous blog details are provided, it outputs itself', () => {
    expect(favoriteBlog(blogsList)).toEqual({
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12
    })
  })
})

describe('author with most blogs', () => {
  test('when no blog is provided', () => {
    expect(mostBlogs([])).toEqual({})
  })

  test('when only one blog is given, the result is itself', () => {
    expect(mostBlogs([blogsList[0]])).toEqual({
      author: 'Michael Chan',
      blogs: 1
    })
  })

  test('when an array of blogs is provided', () => {
    expect(mostBlogs(blogsList)).toEqual({
      author: 'Robert C. Martin',
      blogs: 3
    })
  })
})

describe('author with most blogs like', () => {
  test('when no blog is provided', () => {
    expect(mostLikes([])).toEqual({})
  })

  test('when only one blog is given, the result is itself', () => {
    expect(mostLikes([blogsList[1]])).toEqual({
      author: 'Edsger W. Dijkstra',
      likes: 5
    })
  })

  test('when an array of blogs is provided', () => {
    expect(mostLikes(blogsList)).toEqual({
      author: 'Edsger W. Dijkstra',
      likes: 17
    })
  })
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

afterAll(() => {
  mongoose.connection.close()
})