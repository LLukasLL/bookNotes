const jwt = require('jsonwebtoken')
const booksRouter = require('express').Router()

const Book = require('../models/Book')
const User = require('../models/User')

booksRouter.get('/', async (request, response) => {
  // eslint-disable-next-line no-undef
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)
  const books = await Book.find({ user: user.id })
  // const books = await Book.find({ user: user.id }).populate('bookNotes')

  response.json(books)
})

booksRouter.get('/:id', async (request, response) => {
  // eslint-disable-next-line no-undef
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  // const user = await User.findById(decodedToken.id)
  const book = await Book.findById(request.params.id)
  // if (book.user !== user.username) { response.status(401).json({ error: 'no access to this book, belongs to other user' }) }
  response.json(book)
})

booksRouter.post('/', async (request, response) => {
  // eslint-disable-next-line no-undef
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const user = await User.findById(decodedToken.id)
  const book = new Book(request.body)
  book.user = user._id
  const result = await book.save()
  // user.books = await user.books.concat(result._id)
  await user.save()
  response.status(201).json(result)
})

booksRouter.delete('/:id', async (request, response) => {
  // eslint-disable-next-line no-undef
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  await Book.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

booksRouter.put('/:id', async (request, response) => {
  // eslint-disable-next-line no-undef
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const book = await Book.findById(request.params.id)
  for (const key in request.body) { book[key]=request.body[key] }
  const result = book.save()
  response.status(200).json(result)
})

module.exports = booksRouter