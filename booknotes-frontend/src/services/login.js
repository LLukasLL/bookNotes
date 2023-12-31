import axios from 'axios'
const baseUrl = 'http://localhost:3007'
const route = baseUrl + '/api/login'

const login = async credentials => {
  const response = await axios.post(route, credentials)
  return response.data
}

// eslint-disable-next-line import/no-anonymous-default-export
export default { login }