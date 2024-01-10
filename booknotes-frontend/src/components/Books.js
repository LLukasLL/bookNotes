import Book from "./Book"
import Container from "react-bootstrap/esm/Container"
import { useEffect, useState } from "react"
import { Navigate } from 'react-router-dom'
import bookService from '../services/book'

const Books = ({ user, setErrorMessage }) => {
  const [books, setBooks] = useState([])

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
    if (user !== null && user !== 'not checked') getBooks()
  }, [user])

  return (
      <Container>
        {user ? null : <Navigate replace to="/login" />}
        <div className="books-container">
          { books.map(book => <Book key={book.id} book={book}/>) }
        </div>
      </Container>
  )
}

export default Books