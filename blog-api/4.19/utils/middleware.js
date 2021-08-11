const invalidEndpoint = (request, response) => response.status(404).end()

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    response.status(400).json({
      error: 'malformed id'
    })
  } else if (error.name === 'ValidationError') {
    response.status(400).json({
      error: error.message
    })
  } else if (error.name === 'JsonWebTokenError') {
    response.status(401).json({
      error: error.message
    })
  }
  next(error)
}

module.exports = { invalidEndpoint, errorHandler }