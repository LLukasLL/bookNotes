import axios from 'axios'
const route = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(route)
  return request.then(response => response.data)
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(route, newObject, config)
  return response.data
}

const update = (id, newObject) => {
  const request = axios.put(`${ route }/${id}`, newObject)
  return request.then(response => response.data)
}

export default { getAll, create, update, setToken }