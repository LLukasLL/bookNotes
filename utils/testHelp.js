const bcrypt = require('bcrypt')

const User = require('../models/User')
const Book = require('../models/Book')
const BookNote = require('../models/BookNote')
const Marking = require('../models/Marking')

const login = async (api) => {
  const result = await api
    .post('/api/login')
    .send({ username: 'root', password: 'mySecretPassword' })
  return result.body.token
}

const initializeDB = async () => {
  // delete complete DB
  await User.deleteMany({})
  await Book.deleteMany({})
  await BookNote.deleteMany({})
  await Marking.deleteMany({})

  // intialize root User and save access
  const passwordHash = await bcrypt.hash('mySecretPassword', 10)
  const user = new User({ username: 'root', passwordHash })

  await user.save()

  const rootUserFromDB = await User.find({ username: 'root' })
  const rootUserFromDBObj = rootUserFromDB[0].toJSON()
  const rootID = rootUserFromDBObj.id

  // initialize books:
  const books = [
    {
      title: 'Meditations',
      origTitle: 'Meditations + ...',
      author: 'Marcus Aurelius',
      origAuthor: 'Mark Aurel',
      comments: 'My Favourite Philosophy Book',
      goodreads: '',
      bookNotes: [],
      user: rootID,
    },
    {
      title: 'Meditations - the sequel',
      origTitle: 'Meditations - the sequel + ...',
      author: 'Marcus Aurelius',
      origAuthor: 'Mark Aurel',
      comments: 'My next Favourite Philosophy Book, if it would exist',
      goodreads: '',
      bookNotes: [],
      user: rootID,
    }
  ]

  const Books = books.map(book => new Book(book))
  for (let book of Books) {
    await book.save()
  }

  let booksFromDB = await Book.find({})
  booksFromDB = booksFromDB.map(b => b.toJSON())

  // initialize markings:
  const markings = [
    {
      name: 'Quote',
      color: 'red',
      iconName: 'search',
      user: rootID
    },
    {
      name: 'to research',
      color: 'blue',
      iconName: 'share',
      user: rootID,
    }
  ]
  const Markings = markings.map(marking => new Marking(marking))
  for (let Marking of Markings) {
    await Marking.save()
  }

  let markingsFromDB = await Marking.find({})
  markingsFromDB = markingsFromDB.map(m => m.toJSON())

  // initialize bookNotes:
  const bookNotes = [
    {
      highlight: 'Manus Manum lavat',
      origHighlight: 'Manus Manum lavat',
      comments: 'Not a real quote',
      keywords: ['testy', 'latin'],
      references: [],
      important: true,
      actionTag: '',
      locationStart: 10,
      origLocationStart: 10,
      locationEnd: 12,
      book: booksFromDB[0].id,
      user: rootID,
      marking: markingsFromDB[0].id
    },
    {
      highlight: 'some stoic shit',
      origHighlight: 'some stoic shit',
      comments: 'Not a real quote',
      keywords: ['testy', 'lame'],
      references: [],
      important: false,
      actionTag: '',
      locationStart: 20,
      origLocationStart: 20,
      locationEnd: 24,
      book: booksFromDB[0].id,
      user: rootID,
      marking: markingsFromDB[1].id
    }
  ]
  const BookNotes = bookNotes.map(bookNote => new BookNote(bookNote))
  for (let bookNote of BookNotes) {
    await bookNote.save()
  }
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

const booksInDb = async () => {
  const objects = await Book.find({})
  return objects.map(b => b.toJSON())
}

const bookNotesInDb = async () => {
  const objects = await BookNote.find({})
  return objects.map(b => b.toJSON())
}

const MarkingsInDb = async () => {
  const objects = await Marking.find({})
  return objects.map(b => b.toJSON())
}

const clippingsTest = `How to Think Like a Roman Emperor: The Stoic Philosophy of Marcus Aurelius (Donald Robertson)
- Ihre Markierung auf Seite 7 | bei Position 96-96 | Hinzugefügt am Freitag, 8. Mai 2020 17:23:15

ancient Gnostic texts discovered at Nag Hammadi in Egypt,
==========
How to Think Like a Roman Emperor: The Stoic Philosophy of Marcus Aurelius (Donald Robertson)
- Ihre Notiz auf Seite 7 | bei Position 96 | Hinzugefügt am Freitag, 8. Mai 2020 17:23:22

Research
==========
How to Think Like a Roman Emperor: The Stoic Philosophy of Marcus Aurelius (Donald Robertson)
- Ihre Markierung auf Seite 10 | bei Position 149-151 | Hinzugefügt am Freitag, 8. Mai 2020 17:25:51

The potential value of Stoicism struck me immediately when I stumbled across the French scholar Pierre Hadot’s What Is Ancient Philosophy? (1998) and Philosophy as a Way of Life (2004).
==========
How to Think Like a Roman Emperor: The Stoic Philosophy of Marcus Aurelius (Donald Robertson)
- Ihre Markierung auf Seite 11 | bei Position 164-165 | Hinzugefügt am Freitag, 8. Mai 2020 17:26:42

rational emotive behavior therapy (REBT),
==========
How to Think Like a Roman Emperor: The Stoic Philosophy of Marcus Aurelius (Donald Robertson)
- Ihre Markierung auf Seite 32 | bei Position 478-481 | Hinzugefügt am Freitag, 8. Mai 2020 17:44:52

However, it can also be a bad thing if it becomes so pedantic or overly “academic” that it diverts us from the pursuit of virtue. Marcus learned the same attitude from his Stoic teachers. He repeatedly warned himself not to become distracted by reading too many books—thus wasting time on trifling issues in logic and metaphysics—but instead to remain focused on the practical goal of living wisely. After studying philosophy in Athens for about two
==========
Coach Wooden (Pat Williams;James Denney)
- Ihre Markierung auf Seite 112 | bei Position 1710-1716 | Hinzugefügt am Donnerstag, 21. Mai 2020 16:18:44

“I told him, ‘Zach, from this point on, you’re a leader, not a follower. Your friends aren’t in charge of your behavior—you are. You need to be an influence on your friends, not the other way around. If you try to blame them for your actions, I won’t buy it. You are now the leader of your friends.’ “He said, ‘But Dad, I don’t want to be the leader!’ “‘You have no choice, Zach. When you’re with your friends, you must lead by example.’ “That wasn’t easy for Zach, but he worked at it and really made strides. In time, he invited his friends to our church youth group. Soon, two of Zach’s friends had committed their lives to Jesus Christ.”
==========`

module.exports = {
  initializeDB,
  usersInDb,
  login,
  booksInDb,
  bookNotesInDb,
  clippingsTest,
  MarkingsInDb,
}