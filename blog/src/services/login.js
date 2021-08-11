import axios from 'axios'
const baseUrl = '/api/login'

const login = (credentials) => {
  const result = axios.post(baseUrl, credentials)
  return result.then(response => response.data)
}

export default { login }
