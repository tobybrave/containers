const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const requestLogger = require('morgan')
const blogController = require('./controllers/blog')
const logger = require('./utils/logger')
const config = require('./utils/config')
const { invalidEndpoint, errorHandler } = require('./utils/middleware')

const app = express()

logger.info('connecting to database')
mongoose.connect(config.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
})
  .then((result) => logger.info('connected to database'))
  .catch((error) => logger.error('could not connect to database ', error))

app.use(cors())
app.use(express.json())
app.use(requestLogger('dev'))
app.use('/api/blog', blogController)
app.use(invalidEndpoint)
app.use(errorHandler)

module.exports = app