// eslint-disable-next-line no-unused-vars
const mongoose = require('mongoose')
// const bcrypt = require('bcrypt')
const supertest = require('supertest')

// Reihenfolge geändert, bei Problemen zurückgehen auf Tutorial
// const User = require('../models/User')
const helper = require('../utils/testHelp')
const app = require('../app')

const api = supertest(app)

describe('bookNotes api test', () => {
  beforeEach( async () => {
    await helper.initializeDB()
  })
  test('get all BookNotes for User', async () => {
    const bookNotesAtStart = await helper.bookNotesInDb()
    const token = await helper.login(api)
    const result = await api
      .get('/api/booknotes')
      .set('Authorization', `Bearer ${token}`)

    expect(result.body).toHaveLength(bookNotesAtStart.length)
  })
  test('post works', async () => {
    const bookNotesAtStart = await helper.bookNotesInDb()
    const booksFromDB = await helper.booksInDb()
    const token = await helper.login(api)

    const newBookNote = {
      highlight: 'stoic stuff from Mark',
      comments: 'really not a real quote',
      keywords: ['testy', 'prob greek'],
      references: [],
      important: true,
      actionTag: '',
      book: booksFromDB[0].id
    }

    await api
      .post('/api/booknotes')
      .send(newBookNote)
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const bookNotesAtEnd = await helper.bookNotesInDb()
    expect(bookNotesAtEnd).toHaveLength((bookNotesAtStart.length + 1))

    const books = bookNotesAtEnd.map(b => b.title)
    expect(books).toContain(newBookNote.title)
  })
})
afterAll(async () => {
  await mongoose.connection.close()
})