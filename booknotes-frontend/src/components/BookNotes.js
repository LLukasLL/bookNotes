import { useState, useEffect } from 'react'
import Accordion from 'react-bootstrap/Accordion'
import Button from 'react-bootstrap/esm/Button'
import Container from "react-bootstrap/esm/Container"

import bookNotesService from '../services/bookNote'
import BookNote from './BookNote'

import { useParams } from 'react-router-dom'

const BookNotes = ({ activeBook, setErrorMessage, refresh, setRefresh }) => {
  const [bookNotes, setBookNotes] = useState([])

  const id = useParams()
  
  useEffect(() => {
    async function getBookNotes() {
      try {
        const bookNotes = await bookNotesService.getNotesFromBook(id)
        setBookNotes(bookNotes)
      } catch (exception) {
        setErrorMessage('request failed')
      }
    }
    getBookNotes()
  }, [])

  return (
      <Container>
        <Accordion defaultActiveKey="0" flush>
          <Accordion.Item eventKey="1">
            <Accordion.Header>
              <h2>{activeBook.title + ' - ' + activeBook.author}</h2>
            </Accordion.Header>
            <Accordion.Body>
              {activeBook.comments}
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