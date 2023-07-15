const Book = ({ book, setActiveBook }) => {
  return (
  <div className="book-card" onClick={() => setActiveBook(book)}>
    <span className="title">{book.title}</span>
    <span className="author">{book.author}</span>
    <span>{book.comments}</span>
  </div>
  )
}

export default Book