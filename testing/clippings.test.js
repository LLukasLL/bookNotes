// eslint-disable-next-line no-unused-vars
const mongoose = require('mongoose')
// const bcrypt = require('bcrypt')
const supertest = require('supertest')
// const jwt = require('jsonwebtoken')

// Reihenfolge geändert, bei Problemen zurückgehen auf Tutorial
// const User = require('../models/User')
const helper = require('../utils/testHelp')
const app = require('../app')

const api = supertest(app)

const clippingsTest = `How to Think Like a Roman Emperor: The Stoic Philosophy of Marcus Aurelius (Donald Robertson)
- Ihre Markierung auf Seite 7 | bei Position 96-96 | Hinzugefügt am Freitag, 8. Mai 2020 17:23:15

ancient Gnostic texts discovered at Nag Hammadi in Egypt,
==========
How to Think Like a Roman Emperor: The Stoic Philosophy of Marcus Aurelius (Donald Robertson)
- Ihre Notiz auf Seite 7 | bei Position 96 | Hinzugefügt am Freitag, 8. Mai 2020 17:23:22

Research
==========
How to Think Like a Roman Emperor: The Stoic Philosophy of Marcus Aurelius (Donald Robertson)
- Ihre Markierung auf Seite 10 | bei Position 149-151 | Hinzugefügt am Freitag, 8. Mai 2020 17:25:51

The potential value of Stoicism struck me immediately when I stumbled across the French scholar Pierre Hadot’s What Is Ancient Philosophy? (1998) and Philosophy as a Way of Life (2004).
==========
How to Think Like a Roman Emperor: The Stoic Philosophy of Marcus Aurelius (Donald Robertson)
- Ihre Markierung auf Seite 11 | bei Position 164-165 | Hinzugefügt am Freitag, 8. Mai 2020 17:26:42

rational emotive behavior therapy (REBT),
==========
How to Think Like a Roman Emperor: The Stoic Philosophy of Marcus Aurelius (Donald Robertson)
- Ihre Markierung auf Seite 32 | bei Position 478-481 | Hinzugefügt am Freitag, 8. Mai 2020 17:44:52

However, it can also be a bad thing if it becomes so pedantic or overly “academic” that it diverts us from the pursuit of virtue. Marcus learned the same attitude from his Stoic teachers. He repeatedly warned himself not to become distracted by reading too many books—thus wasting time on trifling issues in logic and metaphysics—but instead to remain focused on the practical goal of living wisely. After studying philosophy in Athens for about two
==========
Coach Wooden (Pat Williams;James Denney)
- Ihre Markierung auf Seite 112 | bei Position 1710-1716 | Hinzugefügt am Donnerstag, 21. Mai 2020 16:18:44

“I told him, ‘Zach, from this point on, you’re a leader, not a follower. Your friends aren’t in charge of your behavior—you are. You need to be an influence on your friends, not the other way around. If you try to blame them for your actions, I won’t buy it. You are now the leader of your friends.’ “He said, ‘But Dad, I don’t want to be the leader!’ “‘You have no choice, Zach. When you’re with your friends, you must lead by example.’ “That wasn’t easy for Zach, but he worked at it and really made strides. In time, he invited his friends to our church youth group. Soon, two of Zach’s friends had committed their lives to Jesus Christ.”
==========`

describe('clippings.txt test run', () => {
  beforeEach( async () => {
    await helper.initializeDB()
  })
  test('all posted Notes get added to DB', async () => {
    const postObj = { clippingsString: clippingsTest }
    const bookNotesAtStart = await helper.bookNotesInDb()
    const token = await helper.login(api)
    await api
      .post('/api/clippings')
      .send(postObj)
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
    const bookNotesAfterPost = await helper.bookNotesInDb()
    expect(bookNotesAfterPost).toHaveLength(bookNotesAtStart.length + 6)
  })
  test('existing Note wont get added to DB', async () => {
    const postObj = { clippingsString: clippingsTest }
    const token = await helper.login(api)
    await api
      .post('/api/clippings')
      .send(postObj)
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
    const bookNotesAtStart = await helper.bookNotesInDb()
    await api
      .post('/api/clippings')
      .send(postObj)
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
    const bookNotesAfterPost = await helper.bookNotesInDb()
    expect(bookNotesAfterPost).toHaveLength(bookNotesAtStart.length)
  })
})
afterAll(async () => {
  await mongoose.connection.close()
})