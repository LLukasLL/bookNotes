const bcrypt = require('bcrypt')

const usersRouter = require('express').Router()
const User = require('../models/User')
// const Blog = require('../modules/Blog')

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  if (username.length < 4) response.status(401).json({ error: 'username must be at least 4 characters long' })
  if (name.length < 4) response.status(401).json({ error: 'name must be at least 4 characters long' })
  if (password.length < 4) response.status(401).json({ error: 'password must be at least 4 characters long' })

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

usersRouter.get('/', async (request, response) => {
  // const users = await User.find({}).populate('books').execPopulate()
  const users = await User.find({})
  response.json(users)
})

module.exports = usersRouter