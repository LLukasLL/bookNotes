const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

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

usersRouter.put('/:id', async (req, res) => {
  // ceck if token is correct and matches the user to be changed
  // eslint-disable-next-line no-undef
  const decodedToken = jwt.verify(req.token, process.env.SECRET)
  if (!decodedToken.id || decodedToken.id !== req.params.id) {
    return res.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById( req.params.id )
  const pwCorrect = user !== null && req.body.password
    ? await bcrypt.compare(req.body.password, user.passwordHash)
    : false
  if (!(user && pwCorrect)) {
    return res.status(401).json({ error: 'invalid username or password' })
  }
  const newPw = req.body.newPassword
  if (newPw) {
    const saltRounds = 10
    user.passwordHash = await bcrypt.hash(newPw, saltRounds)
  }
  const newUsername = req.body.newUsername
  if (newUsername) {
    user.username = newUsername
  }
  const newName = req.body.newName
  if (newName) {
    user.name = newName
  }
  const result = await user.save()
  res.status(200).json(result)
})

module.exports = usersRouter