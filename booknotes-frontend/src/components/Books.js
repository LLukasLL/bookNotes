
import Book from "./Book"
import Container from "react-bootstrap/esm/Container"

const Books = ({ user, books, activeBook, setActiveBook }) => {
  return (
      <Container>
        <div className="books-container">
          { activeBook === null ? books.map(book => <Book key={book.id} book={book} setActiveBook={setActiveBook}/>) : null }
        </div>
      </Container>
  )
}

export default Books