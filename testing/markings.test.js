const mongoose = require('mongoose')
// const jwt = require('jsonwebtoken')
const supertest = require('supertest')

const helper = require('../utils/testHelp')
const app = require('../app')

const api = supertest(app)

// const Marking = require('../models/Marking')

describe('markings api', () => {
  beforeEach(async () => {
    await helper.initializeDB()
  })

  test('get all markings for user', async () => {
    const markingsFromDB = await helper.MarkingsInDb()
    const token = await helper.login(api)
    const result = await api
      .get('/api/markings')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
    expect(result.body).toHaveLength(markingsFromDB.length)
  })

  test('get specific marking by id', async () => {
    const markingsFromDB = await helper.MarkingsInDb()
    const id = markingsFromDB[0].id
    const token = await helper.login(api)
    const result = await api
      .get(`/api/markings/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)

    expect(result.body.id).toBe(id)
  })

  test('post marking', async () => {
    const markingsAtStart = await helper.MarkingsInDb()
    const token = await helper.login(api)
    const newMarking = {
      name: 'Famous Quote',
      color: 'orange',
    }

    await api
      .post('/api/markings')
      .send(newMarking)
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const markingsAfterPost = await helper.MarkingsInDb()

    expect(markingsAfterPost).toHaveLength(markingsAtStart.length + 1)

    const markingsNames = markingsAfterPost.map(m => m.name)
    expect(markingsNames).toContain(newMarking.name)
  })

  test('delete Marking', async () => {
    const markingsAtStart = await helper.MarkingsInDb()
    const token = await helper.login(api)
    const delID = markingsAtStart[markingsAtStart.length -1].id
    await api
      .delete(`/api/markings/${delID}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)
    const markingsAtEnd = await helper.MarkingsInDb()
    expect(markingsAtEnd).toHaveLength(markingsAtStart.length - 1)
  })

  test('put name', async () => {
    const markingsAtStart = await helper.MarkingsInDb()
    const token = await helper.login(api)
    const putID = markingsAtStart[0].id
    const putObj = {
      name: 'updatedMarkingName'
    }
    await api
      .put(`/api/markings/${putID}`)
      .send(putObj)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
    const markingsAtEnd = await helper.MarkingsInDb()
    expect(markingsAtEnd[0].name).toBe(putObj.name)
  })

  test('put name and color', async () => {
    const markingsAtStart = await helper.MarkingsInDb()
    const token = await helper.login(api)
    const putID = markingsAtStart[0].id
    const putObj = {
      name: 'updatedMarkingName',
      color: 'newGreen'
    }
    await api
      .put(`/api/markings/${putID}`)
      .send(putObj)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
    const markingsAtEnd = await helper.MarkingsInDb()
    expect(markingsAtEnd[0].name).toBe(putObj.name)
    expect(markingsAtEnd[0].color).toBe(putObj.color)
  })
})
afterAll(async () => {
  await mongoose.connection.close()
})