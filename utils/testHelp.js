const bcrypt = require('bcrypt')

const User = require('../models/User')
const Book = require('../models/Book')
const BookNote = require('../models/BookNote')
// const BookNote = require('../models/BookNote')

const login = async (api) => {
  const result = await api
    .post('/api/login')
    .send({ username: 'root', password: 'mySecretPassword' })
  // console.log('logintoken: ', result.body.token)
  return result.body.token
}

const initializeDB = async () => {
  // intialize root User
  await User.deleteMany({})
  await Book.deleteMany({})
  await BookNote.deleteMany({})

  const passwordHash = await bcrypt.hash('mySecretPassword', 10)
  const user = new User({ username: 'root', passwordHash })

  await user.save()

  const rootUserFromDB = await User.find({ username: 'root' })
  const rootUserFromDBObj = rootUserFromDB[0].toJSON()
  const rootID = rootUserFromDBObj.id

  const books = [
    {
      title: 'Meditations',
      author: 'Marcus Aurelius',
      comments: 'My Favourite Philosophy Book',
      goodreads: '',
      bookNotes: [],
      user: rootID,
    },
    {
      title: 'Meditations - the sequel',
      author: 'Marcus Aurelius',
      comments: 'My next Favourite Philosophy Book, if it would exist',
      goodreads: '',
      bookNotes: [],
      user: rootID,
    }
  ]

  const Books = books.map(book => new Book(book))
  for (let book of Books) {
    await book.save()
  }

  let booksFromDB = await Book.find({})
  booksFromDB = booksFromDB.map(b => b.toJSON())
  // booksFromDB.forEach(b => rootUserFromDB[0].books = rootUserFromDB[0].books.concat(b.id))
  // await rootUserFromDB[0].save()

  const bookNotes = [
    {
      highlight: 'Manus Manum lavat',
      comments: 'Not a real quote',
      keywords: ['testy', 'latin'],
      references: [],
      important: true,
      actionTag: '',
      book: booksFromDB[0].id,
      user: rootID
    },
    {
      highlight: 'some stoic shit',
      comments: 'Not a real quote',
      keywords: ['testy', 'lame'],
      references: [],
      important: false,
      actionTag: '',
      book: booksFromDB[0].id,
      user: rootID
    }
  ]
  const BookNotes = bookNotes.map(bookNote => new BookNote(bookNote))
  for (let bookNote of BookNotes) {
    await bookNote.save()
  }
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

const booksInDb = async () => {
  const objects = await Book.find({})
  return objects.map(b => b.toJSON())
}

const bookNotesInDb = async () => {
  const objects = await BookNote.find({})
  return objects.map(b => b.toJSON())
}

module.exports = {
  initializeDB,
  usersInDb,
  login,
  booksInDb,
  bookNotesInDb,
}