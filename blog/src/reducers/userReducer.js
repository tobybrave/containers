import blogService from '../services/blogs'
import loginService from '../services/login'

const userReducer = (state=null, action) => {
  switch (action.type) {
    case 'SAVE_USER':
      return action.data.user
    case 'CLEAR_USER':
      return null
    default:
      return state
  }
}

export const getUser = () => {
  const userJSON = window.localStorage.getItem('blogUser')
  const user = JSON.parse(userJSON)
  if (user) {
    blogService.setToken(user.token)
    return {
      type: 'SAVE_USER',
      data: {
        user
      }
    }
  }
  return { type: 'NOTHING' } 
}

export const setUser = (credentials) => {
  return async (dispatch) => {
    const user = await loginService.login(credentials)
    if (user) {
      blogService.setToken(user.token)
      window.localStorage.setItem('blogUser', JSON.stringify(user))

      dispatch({
      type: 'SAVE_USER',
      data: {
        user
      }
    })
    }
  }
}

export const clearUser = () => {
  window.localStorage.removeItem('blogUser')
  blogService.setToken(null)

  return {
    type: 'CLEAR_USER',
    data: null
  }
}

export default userReducer
