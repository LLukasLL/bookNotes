const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const supertest = require('supertest')

// Reihenfolge geändert, bei Problemen zurückgehen auf Tutorial
const User = require('../modules/User')
const helper = require('../utils/testHelp')
const app = require('../app')

const api = supertest(app)
