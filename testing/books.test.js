const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const supertest = require('supertest')

const helper = require('../utils/testHelp')
const app = require('../app')

const api = supertest(app)

describe('books api stuff', () => {
  beforeEach(async () => {
    await helper.initializeDB()
  })

  test('creation of new book', async () => {
    const booksAtStart = await helper.booksInDb()
    const token = await helper.login(api)
    const newBook = {
      title: 'My Diary',
      author: 'Me',
      comments: 'do NOT read !!!',
      goodreads: '',
      // bookNotes: [],
    }

    await api
      .post('/api/books')
      .send(newBook)
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const booksAtEnd = await helper.booksInDb()
    expect(booksAtEnd).toHaveLength((booksAtStart.length + 1))

    const books = booksAtEnd.map(b => b.title)
    expect(books).toContain(newBook.title)
  })

  test('get specific book', async () => {
    const booksAtStart = await helper.booksInDb()
    const token = await helper.login(api)
    const result = await api
      .get(`/api/books/${booksAtStart[0].id}`)
      .set('Authorization', `Bearer ${token}`)
    expect(result.body.id).toBe(booksAtStart[0].id)
  })

  test('logged in user gets assigned to book', async () => {
    const token = await helper.login(api)
    // eslint-disable-next-line no-undef
    const decodedToken = jwt.verify(token, process.env.SECRET)
    const newBook = {
      title: 'My Diary',
      author: 'Me',
      comments: 'do NOT read !!!',
      goodreads: '',
      // bookNotes: [],
    }

    const result = await api
      .post('/api/books')
      .send(newBook)
      .set('Authorization', `Bearer ${token}`)
      .expect(201)

    const nextResult = await api
      .get(`/api/books/${result.body.id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(nextResult.body.user).toBe(decodedToken.id)

  })

  test('delete last book', async () => {
    const booksAtStart = await helper.booksInDb()
    const token = await helper.login(api)

    await api
      .delete(`/api/books/${booksAtStart[booksAtStart.length - 1].id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const booksAtEnd = await helper.booksInDb()
    expect(booksAtEnd).toHaveLength((booksAtStart.length - 1))
  })

  test('update book author', async () => {
    const booksAtStart = await helper.booksInDb()
    const token = await helper.login(api)
    let updatedBookObj = booksAtStart[0]
    updatedBookObj.author = 'Mark Aurel'

    await api
      .put(`/api/books/${booksAtStart[0].id}`)
      .send({ author: 'Mark Aurel' })
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const result = await api
      .get(`/api/books/${booksAtStart[0].id}`)
      .set('Authorization', `Bearer ${token}`)
    expect(result.body.author).toBe('Mark Aurel')
  })

})
afterAll(async () => {
  await mongoose.connection.close()
})
