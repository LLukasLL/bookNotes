const jwt = require('jsonwebtoken')
const clippingsRouter = require('express').Router()

const Clippingstxt = require('../models/Clippingstxt')
const User = require('../models/User')
const Book = require('../models/Book')
const BookNote = require('../models/BookNote')

const extractHighlights = require('../utils/clippingsParser')

clippingsRouter.post('/', async (req, res) => {
  // handle Post request
  // eslint-disable-next-line no-undef
  const decodedToken = jwt.verify(req.token, process.env.SECRET)
  if (!decodedToken.id) {
    return res.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)
  const newClippingstxt = new Clippingstxt({
    content: req.body.clippingsString,
    user: user.id
  })
  // save Clippings String to DB
  const result = await newClippingstxt.save()

  // parse Clippings String to Objects
  const importedNotes = extractHighlights(req.body.clippingsString)

  // create hash Objects for saving existing books and bookNotes
  const books = await Book.find({ user: user.id })
  console.log('# books for this user:', books.length)
  const bookNotes = await BookNote.find({ user: user.id })
  console.log('# bookNotes for this user: ', bookNotes.length)
  const booksHash = {}
  books.map(book => {
    booksHash[book.origTitle] = {
      origAuthor: book.origAuthor,
      id: book.id,
      user: user.id
    }
  })
  const bookNotesHash = {}
  for (let bookNote of bookNotes) {
    const book = await Book.find({ _id: bookNote.book })
    bookNotesHash[bookNote.origHighlight] = {
      locationStart: bookNote.origLocationStart,
      book: book[0].title,
      id: bookNote.id,
      user: user.id
    }
  }

  // check if book already exists for this user, if not save the new Book to MongoDB
  const handleBook = async (note) => {
    // save book to db
    const saveBook = async () => {
      const newBook = new Book({
        title: note.book,
        origTitle: note.book,
        author: note.author,
        origAuthor: note.author,
        user: user.id
      })
      const result = await newBook.save()
      booksHash[note.book] = {
        origAuthor: note.author,
        id: result._id.toHexString()
      }
    }
    if (!booksHash[note.book] ) {
      await saveBook()
    } else if (booksHash[note.book].origAuthor !== note.author) {
      await saveBook()
    }
  }

  // check if bookNote already exists for this user, if not save the new BookNote to MongoDB
  const handleNote = async note => {
    const book = await Book.find({ origTitle: note.book, origAuthor: note.author, user: user.id })
    const bookID = book[0]._id
    const newNote = new BookNote({
      highlight: note.highlight,
      origHighlight: note.highlight,
      locationStart: note.locationStart,
      origLocationStart: note.locationStart,
      locationEnd: note.locationEnd,
      book: bookID,
      user: user.id
    })
    const result = await newNote.save()
    bookNotesHash[note.highlight] = {
      locationStart: note.locationStart,
      book: result.book,
      id: result.id,
      user: user.id
    }
  }
  for (let note of importedNotes) {
    if (!bookNotesHash[note.highlight]) {
      await handleBook(note)
      await handleNote(note)
    } else {
      const hashNote = bookNotesHash[note.highlight]
      if (note.locationStart !== hashNote.locationStart || note.book !== hashNote.book) {
        await handleBook(note)
        await handleNote(note)
      }
    }
  }
  console.log('finished')
  res.status(201).json(result)
})

module.exports = clippingsRouter