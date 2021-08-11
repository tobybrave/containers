import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const getAll = async () => {
  const request = await axios.get(baseUrl)
  return request.data
}

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const config = (token) => {
  return {
    headers: { Authorization: token }
  }
}

const create = async (content) => {
  const result = await axios.post(baseUrl, content, config(token))
  return result.data
}

const update = async (blog) => {
  let { id, likes } = blog
  const updatedLike = {
    likes: likes + 1
  }
  const result = await axios.put(`${baseUrl}/${id}`, updatedLike, config(token))
  return result.data
}

const remove = async (id) => axios.delete(`${baseUrl}/${id}`, config(token))

const createComment = async (comment, id) => {
  const response = await axios.post(`${baseUrl}/${id}/comments`, comment)
  return response.data
}

export default { getAll, setToken, create, update, remove, createComment }

