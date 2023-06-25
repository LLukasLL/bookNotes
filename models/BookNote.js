const mongoose = require('mongoose')

const bookNoteSchema = mongoose.Schema({
  highlight: String,
  comments: Array,
  keywords: Array,
  references: String,
  important: Boolean,
  actionTag: String,
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

// do i need to adjust this for arrays?
bookNoteSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const BookNote = mongoose.model('BookNote', bookNoteSchema)

module.exports = BookNote
