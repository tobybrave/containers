import axios from 'axios'

const baseUrl = '/api/users'

const getUsers = () => {
  return axios.get(baseUrl)
    .then(({ data }) => data)
    .catch((error) => error.response.data)
}

export default { getUsers }
