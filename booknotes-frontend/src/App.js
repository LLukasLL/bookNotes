import { useState, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Routes, 
  Route,
  Navigate,
  useNavigate
} from 'react-router-dom'

import ErrMess from './components/ErrorMessage'
import Message from './components/Message'
import Header from './components/Header'
import LoginForm from './components/Login'
import Books from "./components/Books"
import BookNotes from "./components/BookNotes"
import Register from './components/Register'
import UserPage from './components/UserPage'

import auth from './services/auth'

function App() {
  const [user, setUser] = useState('not checked')
  const [token, setToken] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [message, setMessage] = useState(null)
  const [refresh, setRefresh] = useState(0)
  const [loading, setLoading] = useState(null)
  
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedInAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      auth.setToken(user.token)
    } else {
      setUser(null)
    }
  }, [])
  
  useEffect(() => {
    if (errorMessage !== null) setTimeout(() => {setErrorMessage(null)}, 5000)
  }, [errorMessage])

  const logout = () => {
    setToken('')
    setUser(null)
    auth.setToken('')
    window.localStorage.removeItem('loggedInAppUser')
  }

  return (
    <div className="App">
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
        integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM"
        crossOrigin="anonymous"
      />
      <Router>
        <Header 
          user={user}
          logout={logout}
          setMessage={setMessage}
          setLoading={setLoading}
        />
        <ErrMess errorMessage={errorMessage}/>
        <Message message={message} setMessage={setMessage} loading={loading}/>
        <Routes>
          <Route path='/' element={
            user !== null && user !== 'not checked' ? <Navigate replace to="/books" /> : <Navigate replace to="/login" />
          }/>
          <Route path='/login' element={
            <div style={{padding: 0}}>
              {user !== null && user !== 'not checked' ? <Navigate replace to="/books" /> : null}
              <LoginForm
                user={user}
                setUser={setUser}
                setErrorMessage={setErrorMessage}
              />
            </div>
            }
          />
          <Route path='/register' element={
            <Register
              setErrorMessage={setErrorMessage}
            />}
          />
          <Route path='/books' 
            element={
              <Books
                user={user}
                setErrorMessage={setErrorMessage}
              />
            }
          />
          <Route path='/booknotes/:id' 
            element={<BookNotes
              user={user}
              setErrorMessage={setErrorMessage}
              refresh={refresh}
              setRefresh={setRefresh}
            />}
          />
          <Route path='/user' 
            element={<UserPage
              user={user}
              setErrorMessage={setErrorMessage}
              setMessage={setMessage}
              setLoading={setLoading}
            />}
          />
        </Routes>
      </Router>
      {/* <Footer/> */}
      </div>
  )
}

export default App;
