import { useState, useEffect } from "react"
import Book from "./Book"
import BookNotes from "./BookNotes"
import BookNote from "./BookNote"
import bookService from '../services/book'
import bookNotesService from '../services/bookNote'
import Container from "react-bootstrap/esm/Container"
import Card from 'react-bootstrap/Card'
import Accordion from 'react-bootstrap/Accordion'

const Content = ({ user, setErrorMessage }) => {
  const [activeBook, setActiveBook] = useState(null)
  const [books, setBooks] = useState([])
  const [bookNotes, setBookNotes] = useState([])
  const [noteActive, setNoteActive] = useState(null)

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
  }, [activeBook])

  const toggleActiveNote = bookNote => {
    noteActive === bookNote.id
      ? setNoteActive(null)
      : setNoteActive(bookNote.id)
  }
  
  return (
    <div id='content-wrapper' className='Content'>
      <Container>
        <div className="books-container">
          { activeBook === null ? books.map(book => <Book key={book.id} book={book} setActiveBook={setActiveBook}/>) : null }
        </div>
      </Container>
      {activeBook && <Container>
        <Card>
            <h3 className="title">
              {activeBook.title}
              <svg className="home" onClick={() => setActiveBook(null)} xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="M480-160 160-480l320-320 42 42-248 248h526v60H274l248 248-42 42Z"/></svg>
            </h3>
            <p className="author">{activeBook.author}</p>
        </Card>
      </Container>}
      {activeBook && <BookNotes
        activeBook={activeBook}
        setErrorMessage={setErrorMessage}
        bookNotes={bookNotes}
      />}
      <div className="notes-container">
        {activeBook && bookNotes.map(bookNote => <BookNote 
          key={bookNote.id} 
          bookNote={bookNote} 
          activeBook={activeBook}
          noteActive={noteActive}
          toggleActiveNote={toggleActiveNote}
        />)}
      </div>
    </div>
  )
}

export default Content
