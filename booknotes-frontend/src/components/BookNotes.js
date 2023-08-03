import { useState, useEffect } from 'react'
import Accordion from 'react-bootstrap/Accordion'
import Button from 'react-bootstrap/esm/Button'
import Container from "react-bootstrap/esm/Container"

import bookNotesService from '../services/bookNote'
import BookNote from './BookNote'

const BookNotes = ({ activeBook, setErrorMessage, bookNotes, refresh, setRefresh }) => {

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
              bookNote={bookNote}
              refresh={refresh}
              setRefresh={setRefresh}
            />)}
        </Accordion>
      </Container>
  )
}

export default BookNotes