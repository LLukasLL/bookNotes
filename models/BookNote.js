const mongoose = require('mongoose')

const bookNoteSchema = mongoose.Schema({
  highlight: String,
  origHighlight: String,
  comments: Array,
  keywords: Array,
  references: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BookNote'
  }],
  important: Boolean,
  actionTag: String,
  locationStart: Number,
  origLocationStart: Number,
  locationEnd: Number,
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  marking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Marking'
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
