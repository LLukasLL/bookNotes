import axios from "axios";
import { baseUrl } from "./config";
import auth from "./auth";

const route = baseUrl + '/api/books'

const getAll = async () => {
  const config = auth.getConfig()
  const req = await axios.get(route, config)
  return req.data
}

const create = async newObject => {
  const res = await axios.post(route, newObject, auth.getConfig())
  return res.data
}

const update = (id, newObj) => {
  const req = axios.put(`${ route }/${id}`, newObj, auth.getConfig())
  return req.then(res => res.data)
}

const del = (id) => {
  const req = axios.delete(`${ route }/${id}`, auth.getConfig())
  return req.then(res => res.data)
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  getAll,
  create,
  update,
  del
}