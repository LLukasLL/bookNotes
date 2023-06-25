const jwt = require('jsonwebtoken')
const booksRouter = require('express').Router()

const User = require('../models/User')
const Book = require('../models/Book')
const BookNote = require('../models/BookNote')

// to do:
// define only necessary routes
// get :id, get all from book, post, put
// change Mongoose Schema to allow reference to other Booknotes? = Works ?