const jwt = require('jsonwebtoken')
const markingsRouter = require('express').Router()

const Marking = require('../models/Marking')
const User = require('../models/User')

markingsRouter.get('/', async (req, res) => {
  // eslint-disable-next-line no-undef
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return res.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)
  const markings = await Marking.find({ user: user.id })
  res.json(markings)
})

markingsRouter.get('/:id', async (request, response) => {
  // eslint-disable-next-line no-undef
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  // const user = await User.findById(decodedToken.id)
  const marking = await User.findById(request.params.id)
  response.json(marking)
})


markingsRouter.post('/', async (request, response) => {
  // eslint-disable-next-line no-undef
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)
  const marking = new Marking(request.body)
  marking.user = user._id
  const result = await marking.save()
  // user.markings = await user.markings.concat(result._id)
  // await user.save()
  response.status(201).json(result)
})

markingsRouter.delete('/:id', async (request, response) => {
  // eslint-disable-next-line no-undef
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  await Marking.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

markingsRouter.put('/:id', async (request, response) => {
  // eslint-disable-next-line no-undef
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const marking = await Marking.findById(request.params.id)
  for (const key in request.body) { marking[key]=request.body[key] }
  const result = marking.save()
  response.status(200).json(result)
})
module.exports = markingsRouter