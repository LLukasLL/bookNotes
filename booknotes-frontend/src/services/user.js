import axios from 'axios'
import auth from './auth'
const baseUrl = 'http://localhost:3007'
const route = baseUrl + '/api/users'

const create = async credentials => {
  const response = await axios.post(route, credentials)
  return response.data
}

const changePassword = async (id, passwords) => {
  const response = await axios.put(`${ route }/${id}`, passwords, auth.getConfig())
  return response.data
}

// eslint-disable-next-line import/no-anonymous-default-export
export default { create, changePassword }