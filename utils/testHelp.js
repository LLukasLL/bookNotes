const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

// Reihenfolge geändert, bei Problemen zurückgehen auf Tutorial
const User = require('../modules/User')

const app = require('../app')

const supertest = require('supertest')
const api = supertest(app)

const initializeDB = async () => {

  // intialize root User
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', passwordHash })

  await user.save()
}

module.exports = {
  initializeDB,
}