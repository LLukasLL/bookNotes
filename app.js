const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('express-async-errors')

const app = express()
// utils:
const config = require('./utils/config')
const { info, errorLog } = require('./utils/logger')
// routers:
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const booksRouter = require('./controllers/books')
const bookNotesRouter = require('./controllers/bookNotes')
// const notesRouter = require('./controllers/notes')
const middleware = require('./utils/middleware')


const password = config.MONGODB_URI
const url = `mongodb+srv://lukasmichaelfischer:${password}@clusterlf.zovaiyp.mongodb.net/?retryWrites=true&w=majority`
info('connecting to', url)

mongoose.connect(url)
  // eslint-disable-next-line no-unused-vars
  .then(_result => {
    info('connected to MongoDB')
  })
  .catch((error) => {
    errorLog('error connecting to MongoDB:', error.message)
  })

app.use(cors())
// app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)
// use routers
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/books', booksRouter)
app.use('/api/booknotes', bookNotesRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app