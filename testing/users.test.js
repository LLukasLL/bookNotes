const mongoose = require('mongoose')
// const bcrypt = require('bcrypt')
const supertest = require('supertest')

// Reihenfolge geändert, bei Problemen zurückgehen auf Tutorial
const User = require('../models/User')
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
  test('update password works with correct credentials', async () => {
    const usersAtStart = await helper.usersInDb()
    const userAtStart = await User.findById( usersAtStart[0].id )
    const token = await helper.login(api)
    const res = await api
      .put(`/api/users/${usersAtStart[0].id}`)
      .send({ password: 'mySecretPassword', newPassword: 'Williwillswissen' })
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
    const pwIsNew = res.body.passwordHash !== userAtStart.passwordHash
    expect(pwIsNew).toBe(true)
  })
  test('update password fails with incorrect credentials', async () => {
    const usersAtStart = await helper.usersInDb()
    const userAtStart = await User.findById( usersAtStart[0].id )
    const token = await helper.login(api)
    await api
      .put(`/api/users/${usersAtStart[0].id}`)
      .send({ password: 'wrongPassword', newPassword: 'Williwillswissen' })
      .set('Authorization', `Bearer ${token}`)
      .expect(401)
    const userAtEnd = await User.findById( usersAtStart[0].id )
    const pwIsNew = userAtEnd.passwordHash !== userAtStart.passwordHash
    expect(pwIsNew).toBe(false)
  })
})
afterAll(async () => {
  await mongoose.connection.close()
})