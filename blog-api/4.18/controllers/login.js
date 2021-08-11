const loginRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../models/users')
const config = require('../utils/config')

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body
  if (!(username && password)) {
    return response.status(400).json({
      error: 'Invalid username and password'
    })
  }
  const user = await User.findOne({ username })
  const isPasswordCorrect = user
    ? await bcrypt.compare(password, user.passwordHash)
    : false
  if (!user || !isPasswordCorrect) {
    return response.status(400).json({
      error: 'username or password is incorrect'
    })
  }
  const useForToken = {
    username: user.username,
    id: user._id
  }
  const token = jwt.sign(useForToken, config.TOKEN)
  return response.json({
    token,
    name: user.name
  })
})

module.exports = loginRouter