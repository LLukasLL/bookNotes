import axios from "axios";
import { baseUrl } from "./config";
import auth from "./auth";

const route = baseUrl + '/api/bookNotes'

const getNotesFromBook = async (id) => {
  const config = auth.getConfig()
  const res = await axios.get(`${route}/frombook/${id}`, config)
  return res.data
}

const create = async newObject => {
  const config = auth.getConfig() 
  const res = await axios.post(route, newObject, config)
  return res.date
}

const update = (id, newObj) => {
  const config = auth.getConfig() 
  const req = axios.put(`${ route }/${id}`, newObj, config)
  return req.then(res => res.data)
}

const del = (id) => {
  const config = auth.getConfig() 
  const req = axios.delete(`${ route }/${id}`, config)
  return req.then(res => res.data)
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  getNotesFromBook,
  create,
  update,
  del
}