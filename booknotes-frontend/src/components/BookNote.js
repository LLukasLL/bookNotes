import { useEffect, useState } from "react"

const BookNote = ({ bookNote, noteActive, toggleActiveNote }) => {
  const [modActive, setModActive] = useState(null)
  const [highlight, setHighlight] = useState(bookNote.highlight)
  const [newKeyword, setNewkeyword] = useState('')
  const [newComment, setNewComment] = useState('') 

  const toggleModActive = noteId => {
    modActive === null
      ? setModActive(noteId)
      : setModActive(null)
    }

  useEffect(() => { if (noteActive !== bookNote.id) { setModActive(null) } }, [noteActive])

  const keywords = () => {
   if (noteActive === bookNote.id) {
    if (modActive === bookNote.id) {
      return bookNote.keywords.map(keyword => <div>
          <span>{keyword}</span>
          <span className="deleteX">x</span>
        </div>)
    } else {
      return bookNote.keywords.map(keyword => <span key={keyword}>{keyword}</span>)
    }
   }  
  }

  return (
      <div className="note-card" >
        {noteActive === bookNote.id
          ? <svg className="expLess" onClick={() => toggleActiveNote(bookNote)} xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="m283-345-43-43 240-240 240 239-43 43-197-197-197 198Z"/></svg>
          : <svg className="expMore" onClick={() => toggleActiveNote(bookNote)} xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="M480-345 240-585l43-43 197 198 197-197 43 43-240 239Z"/></svg>
        }
        {noteActive === bookNote.id
          ? <svg className="editBtn" onClick={() => toggleModActive(bookNote.id)} xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="M180-180h44l443-443-44-44-443 443v44Zm614-486L666-794l42-42q17-17 42-17t42 17l44 44q17 17 17 42t-17 42l-42 42Zm-42 42L248-120H120v-128l504-504 128 128Zm-107-21-22-22 44 44-22-22Z"/></svg>
          : null
        }
        {modActive === bookNote.id
          ? <input
              value={highlight}
              onChange={({ target }) => setHighlight(target.value)}
          />
          : <p>{bookNote.highlight}</p> 
        }
        {keywords()}
        {noteActive === bookNote.id 
          ? <p>comments: {bookNote.comments}</p> 
          : null
        }
        {modActive === bookNote.id
          ? <div className="modNote-wrapper">
              <form>
              <input
                placeholder="set new keyword"
                value={newKeyword}
                onChange={({ target }) => setNewkeyword(target.value)}
              />
              <input
                placeholder="add new comment"
                value={newComment}
                onChange={({ target }) => setNewComment(target.value)}
              />
            </form>
          </div>
          : null}
    </div>
  )
}
  
  export default BookNote