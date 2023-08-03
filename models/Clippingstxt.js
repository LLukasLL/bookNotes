const mongoose = require('mongoose')

const clippingstxtSchema = mongoose.Schema({
  content: String,
  date: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

clippingstxtSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Clippingstxt = mongoose.model('Clippingstxt', clippingstxtSchema)

module.exports = Clippingstxt