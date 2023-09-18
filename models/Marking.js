const mongoose = require('mongoose')

const markerSchema = mongoose.Schema({
  name: String,
  color: String,
  borderStyle: String,
  borderColor: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

markerSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Marker = mongoose.model('Book', markerSchema)

module.exports = Marker