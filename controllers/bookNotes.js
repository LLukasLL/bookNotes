const jwt = require('jsonwebtoken')
const bookNotesRouter = require('express').Router()

const User = require('../models/User')
const Book = require('../models/Book')
const BookNote = require('../models/BookNote')

bookNotesRouter.get('/', async (request, response) => {
  // eslint-disable-next-line no-undef
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)
  const bookNotes = await BookNote.find({ user: user.id })
  // const books = await Book.find({ user: user.id }).populate('bookNotes')

  response.json(bookNotes)
})

bookNotesRouter.get('/frombook/:id', async (request, response) => {
  // eslint-disable-next-line no-undef
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)
  const book = await Book.findById(request.params.id)
  const bookNotes = await BookNote.find({ user: user.id, book: book.id })
  // if (book.user !== user.username) { response.status(401).json({ error: 'no access to this book, belongs to other user' }) }
  response.json(bookNotes)
})


bookNotesRouter.get('/:id', async (request, response) => {
  // eslint-disable-next-line no-undef
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  // const user = await User.findById(decodedToken.id)
  const bookNote = await BookNote.findById(request.params.id)
  // if (book.user !== user.username) { response.status(401).json({ error: 'no access to this book, belongs to other user' }) }
  response.json(bookNote)
})


bookNotesRouter.post('/', async (request, response) => {
  // eslint-disable-next-line no-undef
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const user = await User.findById(decodedToken.id)
  const bookNote = new BookNote(request.body)
  bookNote.user = user._id
  const result = await bookNote.save()
  response.status(201).json(result)
})

bookNotesRouter.delete('/:id', async (request, response) => {
  // eslint-disable-next-line no-undef
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  await BookNote.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

bookNotesRouter.put('/:id', async (request, response) => {
  // eslint-disable-next-line no-undef
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const bookNote = await BookNote.findById(request.params.id)
  for (const key in request.body) { bookNote[key]=request.body[key] }
  const result = await bookNote.save()
  response.status(200).json(result)
})

module.exports = bookNotesRouter
