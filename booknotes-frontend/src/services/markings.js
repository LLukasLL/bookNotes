import axios from "axios";
import { baseUrl } from "./config";
import auth from "./auth";

const route = baseUrl + '/api/markings'

const getAll = async () => {
  const req = await axios.get(route, auth.getConfig())
  return req.data
}

const get = async (id) => {
  const req = await axios.get(`${ route }/${id}`, auth.getConfig())
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
  get,
  create,
  update,
  del
}