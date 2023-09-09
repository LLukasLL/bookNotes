// eslint-disable-next-line no-unused-vars
const mongoose = require('mongoose')
// const bcrypt = require('bcrypt')
const supertest = require('supertest')
const jwt = require('jsonwebtoken')

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
      locationStart: 10,
      locationEnd: 12,
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

  test('put works', async () => {
    const bookNotesAtStart = await helper.bookNotesInDb()
    const token = await helper.login(api)
    let updatedBookObj = bookNotesAtStart[0]
    updatedBookObj.author = 'Mark Aurel'

    await api
      .put(`/api/booknotes/${bookNotesAtStart[0].id}`)
      .send({ keywords: bookNotesAtStart[0].keywords.concat('added keyword') })
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const result = await api
      .get(`/api/booknotes/${bookNotesAtStart[0].id}`)
      .set('Authorization', `Bearer ${token}`)
    expect(result.body.keywords).toContain('added keyword')
  })

  test('delete works', async () => {
    const bookNotesAtStart = await helper.bookNotesInDb()
    const token = await helper.login(api)

    await api
      .delete(`/api/bookNotes/${bookNotesAtStart[bookNotesAtStart.length - 1].id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)
    const bookNotesAtEnd = await helper.bookNotesInDb()
    expect(bookNotesAtEnd).toHaveLength((bookNotesAtStart.length - 1))

  })

  test('logged in user gets assigned to bookNote', async () => {
    const booksFromDB = await helper.booksInDb()
    const token = await helper.login(api)
    // eslint-disable-next-line no-undef
    const decodedToken = jwt.verify(token, process.env.SECRET)

    const newBookNote = {
      highlight: 'stoic stuff from Mark',
      comments: 'really not a real quote',
      keywords: ['testy', 'prob greek'],
      references: [],
      important: true,
      actionTag: '',
      locationStart: 14,
      locationEnd: 16,
      book: booksFromDB[0].id
    }

    const result = await api
      .post('/api/booknotes')
      .send(newBookNote)
      .set('Authorization', `Bearer ${token}`)
      .expect(201)

    const nextResult = await api
      .get(`/api/booknotes/${result.body.id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(nextResult.body.user).toBe(decodedToken.id)

  })
})
afterAll(async () => {
  await mongoose.connection.close()
})