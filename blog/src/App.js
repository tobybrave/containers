import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Switch, Route, useRouteMatch } from 'react-router-dom'
import { Spinner } from 'react-bootstrap'
import userService from './services/user'
import { notifier, errorNotifier } from './reducers/notificationReducer'
import { initializeBlog, createBlog, likeBlog, deleteBlog } from './reducers/blogReducer'
import { getUser, clearUser } from './reducers/userReducer'
import Blogs from './components/Blogs'
import Blog from './components/Blog'
import Login from './components/Login'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import Users from './components/Users'
import User from './components/User'
import NavBar from './components/NavBar'
//import './App.css'

const byLikes = (prev, current) => prev.likes - current.likes

const App = () => {
  const blogs = useSelector(({ blogs }) => blogs.sort(byLikes).reverse())
  const user = useSelector(({ user }) => user)

  const dispatch = useDispatch()
  const createBlogRef = React.createRef()

  const [users, setUsers] = useState([])

  const matchUser = useRouteMatch('/users/:id')
  const userDetails = matchUser
    ? users.find(({ id }) => id === matchUser.params.id)
    : null

  const matchBlog = useRouteMatch('/blogs/:id')
  const blogInfo = matchBlog
    ? blogs.find(({ id }) => id === matchBlog.params.id)
    : null

  useEffect(() => {
    dispatch(initializeBlog())
  }, [dispatch])

  useEffect(() => {
    dispatch(getUser())
  }, [dispatch])

  useEffect(() => {
    userService.getUsers()
      .then((data) => setUsers(data))
      .catch((error) => dispatch(errorNotifier('ERROR_OCCURRED')))
  }, [dispatch])

  const handleLogout = () => {
    dispatch(clearUser())
  }

  const handleCreateBlog = async (blogContent) => {
    if (user) {
      createBlogRef.current.toggleVisibility()

      try{
        await dispatch(createBlog(blogContent))
        dispatch(notifier(`a new blog ${blogContent.title} by ${blogContent.author} added`))
      } catch(error) {
        dispatch(errorNotifier('An error occurred'))
      }
    }
  }

  const handleLike = async (blog) => {
    await dispatch(likeBlog(blog))
  }

  const handleRemove = async (blog) => {
    if (window.confirm(`remove ${blog.title} by ${blog.author}`)) {
      try{
        await dispatch(deleteBlog(blog.id))
      } catch (error) {
        dispatch(errorNotifier('An error occurred'))
      }
    }
  }

  const userHomePage = () => {
    return(

      <div>
        <NavBar
          user={user.name}
          handleLogout={handleLogout}
        />
        <h2>blog app</h2>

        <Switch>
          <Route exact path='/'>
            <Togglable buttonLabel='create new blog' ref={createBlogRef}>
              <BlogForm
                createBlog={handleCreateBlog}
              />
            </Togglable>
            {blogs.length
              ? blogs.map(blog =>
                <Blogs
                  key={blog.id}
                  blog={blog}
                />)
              : <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
                </Spinner>
            }
          </Route>
        </Switch>
        <Switch>
          <Route path='/blogs/:id'>
            <Blog
              blog={blogInfo}
              handleLike={handleLike}
              handleRemove={handleRemove}
              user={user.name}
            />
          </Route>
          <Route path='/users/:id'>
            <User user={userDetails} />
          </Route>
          <Route path='/users'>
            <Users users={users}/>
          </Route>
        </Switch>
      </div>
    )
  }

  return (
    <div>
      <Notification />
      {
      !user
        ? <Login />
        : userHomePage()
      }
    </div>
  )
}

export default App
