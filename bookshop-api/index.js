const {
  ApolloServer,
  gql,
  UserInputError,
  AuthenticationError
} = require('apollo-server')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const Author = require('./models/authors')
const Book = require('./models/books')
const User = require('./models/users')

const config = {
  TOKEN: 'someRandomValidText'
}

console.log('connecting to database')
const mongodb = 'mongodb://localhost:27017/db'
mongoose.connect(mongodb, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
})
  .then(({ connection }) => console.log(`:) connected to ${connection.host}`))
  .catch((error) => console.error(`:( could not connect. Error: ${error}`))
  
const typeDefs = gql`
  type Authors {
    name: String!
    id: ID!
    born: Int
    bookCount: Int!
  }

  type Books {
    title: String!
    published: Int!
    author: Authors!
    id: ID!
    genres: [String!]!
  }
  
  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }
  
  type Token {
    value: String!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Books]
    allAuthors: [Authors!]!
    me: User
  }
  
  type Mutation {
    addBook(
    title: String!
    published: Int!
    author: String!
    genres: [String!]!
    ): Books
    
    editAuthor(
    name: String!
    born: Int!
    ): Authors
    
    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    
    login(
      username: String!
      password: String!
    ): Token
  }
  
`

const authorBooks = async (authorsId) => {
  const authorsIdArr = Array.isArray(authorsId) ? authorsId : [authorsId]
  return Book.find({
    author: {
      $in: authorsIdArr
    }
    }).populate('author')
}
      
const bookCount = (authorBooksArr, id) => authorBooksArr.filter(({ author }) => JSON.stringify(author._id) === JSON.stringify(id))

const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments()
      ,
    authorCount: () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      
      let result = []
      if (!(args.author || args.genre)) {
        return Book.find({}).populate('author')
      }
      /*
      if (args.author) {
        result = result.concat(books.filter(({ author }) => author === args.author))
      }
      */
    
      if (args.genre) {
        result = result.concat(await Book.find({
          genres: {
            $in: [args.genre]
          }
        }).populate('author')
        )
      }
      
      return result
      },
    allAuthors: async () => {
      const authors = await Author.find({})
      const authorsId = authors.map(({ _id }) => _id)
      
      const allAuthorBooks = await authorBooks(authorsId)
      return authors.map((author) => {
        return {
          ...author.toJSON(),
          bookCount: bookCount(allAuthorBooks, author._id).length
        }
      })
    },
    me: (root, args, { currentUser }) => currentUser
  },
  Mutation: {
    addBook: async (root, args, { currentUser }) => {
      if (!currentUser) throw new AuthenticationError('Access denied')
      let author = await Author.findOne({ name: args.author })
      
      if (!author) {
        const newAuthor = new Author({
          name: args.author
        })
        try {
          author = await newAuthor.save()
        } catch (error) {
          throw new UserInputError(error.message)
        }
        
      }
      
      const books = new Book({
        ...args,
        author: author.id
      })
      
      try {
        const savedBook = await books.save()
        currentUser.books = currentUser.books.concat(savedBook._id)
        await currentUser.save()
        return savedBook
      } catch (error) {
        throw new UserInputError(error.message)
      }
    },
    editAuthor: async (root, args, { currentUser }) => {
      if (!currentUser) throw new AuthenticationError('Access denied')
      const author = await Author.findOne({
        name: args.name
      })
      if (!author) {
        return null
      }
      
      author.born = args.born
      
      try {
        await author.save()
      } catch(error) {
        throw new UserInputError(error.message)
      }
      
      const editedAuthorBook = await authorBooks(author._id)
      
      author.bookCount = editedAuthorBook.length
      
      return author
      },
    createUser: (root, args) => {
      const user = new User({
        ...args
      })
      return user.save()
    },
    login: async (root, args) => {
      const username = args.username ? await User.findOne({ username: args.username }) : null
      
      if (!username || args.password !== 'password') throw new AuthenticationError('Incorrect username or password')
      
      const userForToken = {
        username,
        id: username._id
      }
      
      return {
        value: jwt.sign(userForToken, config.TOKEN)
      }
      
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(auth.substring(7), config.TOKEN)
      const currentUser = await User.findById(decodedToken.id)
      return { currentUser }
    }
  }
})

server.listen().then(({ url }) => console.log(`serving at ${url}`))

