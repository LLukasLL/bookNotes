import { useState, useEffect } from 'react'

import ErrMess from './components/ErrMess'

import Header from './components/Header'
import LoginForm from './components/Login'
import Content from './components/Content'

import loginService from './services/login'
import auth from './services/auth'

function App() {
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)
  const [token, setToken] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedInAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      auth.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    if (errorMessage !== null) setTimeout(() => {setErrorMessage(null)}, 500)
  }, [errorMessage])

  const loginForm = () => {    
    return (
        <LoginForm
          username={username}
          password={password}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          handleSubmit={handleLogin}
        />
  )}
  const content = () => {
    return (
      <div>
        <Content
          user={user}
          setErrorMessage={setErrorMessage}
        />
      </div>
    )
  }
  const logout = () => {
    setUser(null)
    setToken('')
    auth.setToken('')
    window.localStorage.removeItem('loggedInAppUser')
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem( 'loggedInAppUser', JSON.stringify(user) )
      setToken(user.token)
      auth.setToken(user.token)
      console.log('Token has been set: ', user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 500)
    }
  } 
  return (
    <div className="App">
      <Header user={user} setUser={setUser} logout={logout}/>
      <ErrMess errorMessage={errorMessage}/>
      {user === null ? loginForm() : content()}
      {/* <Footer/> */}
    </div>
  )
}

export default App;
