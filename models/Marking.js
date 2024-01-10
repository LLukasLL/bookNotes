const mongoose = require('mongoose')

const markingSchema = mongoose.Schema({
  name: String,
  color: String,
  iconName: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

markingSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Marking = mongoose.model('Marking', markingSchema)

module.exports = Marking