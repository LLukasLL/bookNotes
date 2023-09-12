import { useState, useEffect } from 'react'
import Accordion from 'react-bootstrap/Accordion'
import Container from "react-bootstrap/esm/Container"

import bookNotesService from '../services/bookNote'
import bookService from '../services/book'
import BookNote from './BookNote'

import { useParams } from 'react-router-dom'

const BookNotes = ({ user, setErrorMessage, refresh, setRefresh }) => {
  const [bookNotes, setBookNotes] = useState([])
  const [book, setBook] = useState([])

  const { id } = useParams()

  useEffect(() => {
    async function getBookNotes() {
      try {
        const bookNotes = await bookNotesService.getNotesFromBook(id)
        setBookNotes(bookNotes)
      } catch (exception) {
        setErrorMessage('request failed')
      }
    }
    async function getBook() {
      try{
        const book = await bookService.get(id)
        setBook(book)
      } catch {
        setErrorMessage('request failed')
      }
    }
    if (user !== null && user !== 'not checked') {
      getBook()
      getBookNotes()
    }
  }, [user])

  return (
      <Container>
        <Accordion defaultActiveKey="0" flush>
          <Accordion.Item eventKey="1">
            <Accordion.Header>
              {book ? <h2>{book.title + ' - ' + book.author}</h2> : null}
            </Accordion.Header>
            <Accordion.Body>
              {book.comments}
            </Accordion.Body>
          </Accordion.Item>
          {bookNotes
            .sort((a,b) => a.locationStart - b.locationStart)
            .map(bookNote => <BookNote
              key={bookNote.id}
              bookNote={bookNote}
              refresh={refresh}
              setRefresh={setRefresh}
            />)}
        </Accordion>
      </Container>
  )
}

export default BookNotes