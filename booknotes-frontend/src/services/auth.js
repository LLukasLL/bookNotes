let token = null;
const getToken = () => `Bearer ${token}`
const setToken = newToken => token = newToken
const getConfig = () => { return { headers: { Authorization: getToken() }, } }

export default { getToken, setToken, getConfig }