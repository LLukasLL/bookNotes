const mongoose = require('mongoose')

const bookSchema = mongoose.Schema({
  title: String,
  author: String,
  comments: String,
  goodreads: String,
  /*
  bookNotes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BookNote'
    }
  ],
  */
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

bookSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const User = mongoose.model('User', bookSchema)

module.exports = User