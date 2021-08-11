const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 4
  },
  favoriteGenre: {
    type: String,
    required: true
  },
  books: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book'
  }]
})
mongoose.plugin(uniqueValidator)

userSchema.set('toJSON', {
  transform: (document, resultObjectId) => {
    resultObjectId.id = resultObjectId._id
    
    delete resultObjectId._id
    delete resultObjectId.__v
  }
})

module.exports = mongoose.model('User', userSchema)
