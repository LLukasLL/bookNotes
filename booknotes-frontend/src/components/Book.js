import { useNavigate } from 'react-router-dom';

const Book = ({ book, setActiveBook }) => {

  const navigate = useNavigate()
  const handleBookSelect = () => {
    navigate('/booknotes/' + book.id)
  }

  return (
  <div className="book-card" onClick={() => handleBookSelect()}>
    <span className="title">{book.title}</span>
    <span className="author">{book.author}</span>
    <span>{book.comments}</span>
  </div>
  )
}

export default Book