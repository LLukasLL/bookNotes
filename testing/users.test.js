const mongoose = require('mongoose')
// const bcrypt = require('bcrypt')
const supertest = require('supertest')

// Reihenfolge geändert, bei Problemen zurückgehen auf Tutorial
// const User = require('../models/User')
const helper = require('../utils/testHelp')
const app = require('../app')

const api = supertest(app)

describe('user creation and login', () => {
  beforeEach(async () => {
    await helper.initializeDB()
  })

  test('creation of new user', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'newUsername',
      name: 'Test User',
      password: 'testPassword'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('user creation fails with existing username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Test User',
      password: 'testPassword'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('expected `username` to be unique')
    const usersAtEnd = await helper.usersInDb()

    expect(usersAtEnd).toEqual(usersAtStart)
  })
})
afterAll(async () => {
  await mongoose.connection.close()
})