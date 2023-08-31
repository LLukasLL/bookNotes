const jwt = require('jsonwebtoken')
const clippingsRouter = require('express').Router()

const Clippingstxt = require('../models/Clippingstxt')
const User = require('../models/User')
const Book = require('../models/Book')
const BookNote = require('../models/BookNote')

const extractHighlights = require('../utils/clippingsParser')

clippingsRouter.post('/', async (req, res) => {
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
  const result = await newClippingstxt.save()
  const importedNotes = extractHighlights(req.body.clippingsString)
  console.log(importedNotes)
  // save new Notes and Books to DB:
  const books = await Book.find({})
  const bookNotes = await BookNote.find({})
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
    if (!booksHash[note.book]) {
      await saveBook()
    } else if (booksHash[note.book].origAuthor !== note.author) {
      await saveBook()
    }
  }
  const handleNote = async note => {
    const book = await Book.find({ origTitle: note.book, origAuthor: note.author })
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
  res.status(201).json(result)
})

module.exports = clippingsRouter