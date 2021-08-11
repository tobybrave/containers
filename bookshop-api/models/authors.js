const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

mongoose.plugin(uniqueValidator)

const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 4
  },
  born: {
    type: Number
  }
})

authorSchema.set('toJSON', {
  transform: (document, resultObjectId) => {
    resultObjectId.id = resultObjectId._id
    
    delete resultObjectId._id
    delete resultObjectId.__v
  }
})

module.exports = mongoose.model('Author', authorSchema)
