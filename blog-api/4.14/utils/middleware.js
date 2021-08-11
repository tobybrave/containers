const invalidEndpoint = (request, response) => response.status(404).end()

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).json({
      error: 'malformed id'
    })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({
      error: error.message
    })
  }
  return next(error)
}

modules.exports = { invalidEndpoint, errorHandler }