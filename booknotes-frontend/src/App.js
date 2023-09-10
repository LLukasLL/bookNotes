import { useState, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Routes, Route, Link,
  useParams, useNavigate, redirect,
  Navigate
} from 'react-router-dom'

import ErrMess from './components/ErrMess'
import Message from './components/Message'
import Header from './components/Header'
import LoginForm from './components/Login'
import Books from "./components/Books"
import BookNotes from "./components/BookNotes"
import Register from './components/Register'

import bookService from './services/book'
import bookNotesService from './services/bookNote'
import loginService from './services/login'
import userService from './services/user'
import auth from './services/auth'

import Container from "react-bootstrap/esm/Container"

function App() {
  const [username, setUsername] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('') 
  const [confirmPassword, setConfirmPassword] = useState('')
  const [user, setUser] = useState('not checked')
  const [token, setToken] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [message, setMessage] = useState(null)
  const [refresh, setRefresh] = useState(0)
  const [activePage, setActivePage] = useState(null)
  const [loading, setLoading] = useState(null)
  
  const [activeBook, setActiveBook] = useState(null)
  const [books, setBooks] = useState([])
  const [bookNotes, setBookNotes] = useState([])

  
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
    if (errorMessage !== null) setTimeout(() => {setErrorMessage(null)}, 500)
  }, [errorMessage])

  const logout = () => {
    setBooks(null)
    setBookNotes(null)
    setActiveBook(null)
    setActivePage(null)
    setToken('')
    setUser(null)
    auth.setToken('')
    window.localStorage.removeItem('loggedInAppUser')
    redirect('/login')
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem( 'loggedInAppUser', JSON.stringify(user) )
      setToken(user.token)
      auth.setToken(user.token)
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

  const handleRegister = async e => {
    e.preventDefault()
    try {
      const newUser = {
        username: username,
        name: name,
        password: password
      }
      await userService.create(newUser)
      redirect('/login')
    } catch (exception) {
      setErrorMessage(exception)
      setTimeout(() => setErrorMessage(null), 500)
    }
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
          setActiveBook={setActiveBook}
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
                username={username}
                password={password}
                handleUsernameChange={({ target }) => setUsername(target.value)}
                handlePasswordChange={({ target }) => setPassword(target.value)}
                handleSubmit={handleLogin}
                setActivePage={setActivePage}
              />
            </div>
            }
          />
          <Route path='/register' element={
            <Register
              username={username}
              name={name}
              password={password}
              confirmPassword={confirmPassword}
              handleUsernameChange={({ target }) => setUsername(target.value)}
              handleNameChange={({ target }) => setName(target.value)}
              handlePasswordChange={({ target }) => setPassword(target.value)}
              handleConfirmPasswordChange={({ target }) => setConfirmPassword(target.value)}
              handleSubmit={handleRegister}
              setActivePage={setActivePage}
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
              activeBook={activeBook}
              setErrorMessage={setErrorMessage}
              bookNotes={bookNotes}
              refresh={refresh}
              setRefresh={setRefresh}
            />}
          />
        </Routes>
      </Router>
      {/* <Footer/> */}
      </div>
  )
}

export default App;
