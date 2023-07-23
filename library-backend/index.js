const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { v1: uuid } = require('uuid')
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const Author = require('./models/author')
const Book = require('./models/book')
const { GraphQLError } = require('graphql')

require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI

console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

const typeDefs = `

  type Query {
    bookCount: Int!
    allBooks(author: String, genre: String): [Book]!

    authorCount: Int!
    allAuthors: [Author]!
  }
  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String]
    ): Book

    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
  }
  type Book {
    title: String!
    author: Author!
    published: Int!
    genres: [String]
    id: ID!
  }
  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int!
  }
`

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    allBooks: async (root, args) => {
      var filtered = await Book.find({}).populate('author')
      if (args.author) filtered = filtered.filter(b => b.author.name === args.author)
      if (args.genre) filtered = filtered.filter(b => b.genres.includes(args.genre))
      return filtered
    },

    authorCount: async () => Author.collection.countDocuments(),
    allAuthors: async () => Author.find({}),
  },
  Mutation: {
    addBook: async (root, args) => {
      const exists = await Book.exists({ title: args.title })
      try {
        const author = await Author.findOne({ name: args.author })
        if (exists) {
          return Book.findOneAndUpdate({ title: args.title }, { ...args, author: author }, {new: true})
                     .populate('author')
        }
        const book = new Book({ ...args, author: author })
        await book.save()
        return book.populate('author')
      } catch (error) {
        throw new GraphQLError('Saving book failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.title,
            error
          }
        })
      }
    },
    editAuthor: async (root, { name, setBornTo } ) => {
      try {
        var exists = await Author.exists({ name: name })
        if (exists) {
          return Author.findOneAndUpdate({ name: name }, { born: setBornTo }, {new: true})
        }
        const newAuthor = new Author({name: name, born: setBornTo})
        await newAuthor.save()
        return newAuthor
      } catch (error) {
        throw new GraphQLError('Saving author failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: name,
            error
          }
        })
      }
    }
  },
  Book: {
  },
  Author: {
    bookCount: async (root) => Book.find({ author: root.id }).countDocuments(),
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
