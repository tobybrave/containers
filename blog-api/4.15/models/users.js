const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
  username: String,
  passwordHash: String,
  name: String
})

mongoose.plugin(uniqueValidator)

mongoose.set('toJSON', {
  transform: (doc, resultObjectId) => {
    resultObjectId.id = resultObjectId._id
    delete resultObjectId._id
    delete resultObjectId.__v
    delete resultObjectId.passwordHash
  }
})

module.exports = mongoose.model('User', userSchema)