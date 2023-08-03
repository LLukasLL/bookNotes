import { useState, useEffect } from 'react'

import ErrMess from './components/ErrMess'
import Header from './components/Header'
import LoginForm from './components/Login'
import Book from "./components/Book"
import BookNotes from "./components/BookNotes"
import bookService from './services/book'
import bookNotesService from './services/bookNote'

import loginService from './services/login'
import auth from './services/auth'

import Container from "react-bootstrap/esm/Container"

function App() {
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)
  const [token, setToken] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [refresh, setRefresh] = useState(0)
  const [activePage, setActivePage] = useState(null)


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


  const [activeBook, setActiveBook] = useState(null)
  const [books, setBooks] = useState([])
  const [bookNotes, setBookNotes] = useState([])

  useEffect(() => {
    async function getBooks() {
      try {
        const books = await bookService.getAll()
        setBooks(books)
      } catch (exception) {
        console.log('error catched')
        setErrorMessage('request failed')
      }
    }
    async function getBookNotes() {
      try {
        const bookNotes = await bookNotesService.getNotesFromBook(activeBook.id)
        setBookNotes(bookNotes)
      } catch (exception) {
        setErrorMessage('request failed')
      }
    }
    setBookNotes([])
    activeBook === null ? getBooks() : getBookNotes()
  }, [activeBook, refresh])

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
    <div id='content-wrapper' className='Content'>
      <Container>
        <div className="books-container">
          { activeBook === null ? books.map(book => <Book key={book.id} book={book} setActiveBook={setActiveBook}/>) : null }
        </div>
      </Container>
      {activeBook && <BookNotes
        activeBook={activeBook}
        setErrorMessage={setErrorMessage}
        bookNotes={bookNotes}
        refresh={refresh}
        setRefresh={setRefresh}
      />}
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
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
        integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM"
        crossOrigin="anonymous"
      />
      <Header 
        user={user}
        logout={logout}
        setActiveBook={setActiveBook}
      />
      <ErrMess errorMessage={errorMessage}/>
      {user === null ? loginForm() : content()}
      {/* <Footer/> */}
      </div>
  )
}

export default App;
