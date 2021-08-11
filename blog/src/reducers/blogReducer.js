import blogService from '../services/blogs'

const blogReducer = (state=[], action) => {
  switch (action.type) {
    case 'BLOG_INIT':
      return action.data
    case 'NEW_BLOG':
      return [...state, action.data]
    case 'LIKE_BLOG': {
     const blog = state.find((blog) => blog.id === action.id)
     const updatedBlog = {
       ...blog, likes: action.data.likes
     }
     
     return state.map((blog) => blog.id === action.id ? updatedBlog : blog)
    }
    case 'DELETE_BLOG':
      return state.filter((blog) => blog.id !== action.id)
    default:
      return state
  }
}

export const initializeBlog = () => {
  return async (dispatch) => {
    const data = await blogService.getAll()
    
    dispatch({
      data,
      type: 'BLOG_INIT',
    })
  }
}

export const createBlog = (blog) => {
  return async (dispatch) => {
    const data = await blogService.create(blog)
    
    dispatch({
      data,
      type: 'NEW_BLOG'
    })
  }
}

export const likeBlog = (blog) => {
  return async (dispatch) => {
    const data = await blogService.update(blog)
    dispatch({
      data,
      type: 'LIKE_BLOG',
      id: blog.id
    })
  }
}

export const deleteBlog = (id) => {
  return async (dispatch) => {
    await blogService.remove(id)
    dispatch({
      id,
      type: 'DELETE_BLOG'
    })
  }
}

export default blogReducer

