const jwt = require('jsonwebtoken')
const clippingsRouter = require('express').Router()

const Clippingstxt = require('../models/Clippingstxt')
const User = require('../models/User')

clippingsRouter.post('/', async (req, res) => {
  // eslint-disable-next-line no-undef
  const decodedToken = jwt.verify(req.token, process.env.SECRET)
  if (!decodedToken.id) {
    return res.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)
  const newClippingstxt = new Clippingstxt(req.body)
  newClippingstxt.user = user._id
  const result = await newClippingstxt.save()
  res.status(201).json(result)
})