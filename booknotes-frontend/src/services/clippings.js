import axios from "axios";
import { baseUrl } from "./config";
import auth from "./auth";

const route = baseUrl + '/api/clippings'

const upload = async newObject => {
  const res = await axios.post(route, newObject, auth.getConfig())
  return res.data
}

export default {
  upload,
}