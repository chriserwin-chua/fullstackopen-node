const { GraphQLError } = require('graphql');
const jwt = require('jsonwebtoken');
const User = require('./models/user');
const Book = require('./models/book');
const Author = require('./models/author');
const { PubSub } = require('graphql-subscriptions');
const book = require('./models/book');
const author = require('./models/author');
const pubsub = new PubSub();

const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      if (!args.name && !args.genre) {
        return await Book.find({}).populate('author');
      }
      if (args.name && args.genre) {
        const filterAuthor = await Author.find({ name: args.name });
        const result = await Book.find({
          author: filterAuthor,
          genres: args.genre,
        }).populate('author');
        return result;
      }
      if (args.name) {
        const filterAuthor = await Author.find({ name: args.name });
        const result = await Book.find({ author: filterAuthor }).populate(
          'author'
        );
        return result;
      }
      if (args.genre) {
        const result = await Book.find({
          genres: args.genre,
        }).populate('author');
        return result;
      }
      // if (args.name) return books.filter((book) => book.author === args.name);
      // if (args.genre)
      //   return books.filter((book) => book.genres.includes(args.genre));
    },
    allAuthors: async () => {
      const result = await Author.find({}).populate('books');
      const withBookCount = result.map((author) => {
        // console.log(author.books);
        return {
          ...author._doc,
          id: author._id,
          bookCount: author.books.length,
        };
      });
      //console.log(withBookCount);
      return withBookCount;
    },
    me: (root, args, context) => {
      return context.currentUser;
    },
  },
  // Author: {
  //   bookCount: (root) =>
  //     books.filter((book) => root.name === book.author).length,
  // },
  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser;
      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }
      const authorCheck = await Author.findOne({ name: args.author });
      let book;
      if (!authorCheck) {
        const newAuthor = new Author({ name: args.author });
        const newAuthorResult = await newAuthor.save();
        book = new Book({ ...args, author: newAuthorResult });
      } else {
        book = new Book({ ...args, author: authorCheck });
      }

      try {
        await book.save();
      } catch (error) {
        throw new GraphQLError('Failed to Add New Book.', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error,
          },
        });
      }

      pubsub.publish('BOOK_ADDED', { bookAdded: book });

      return book;
    },
    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser;
      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }
      const author = await Author.findOne({ name: args.name });
      if (!author) {
        return new GraphQLError('Author does not exist', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
          },
        });
      }
      author.born = args.setBornTo;
      try {
        await author.save();
      } catch (error) {
        throw new GraphQLError('Updating Author Failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error,
          },
        });
      }
    },
    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
      });

      return user.save().catch((error) => {
        throw new GraphQLError('Creating the user failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.username,
            error,
          },
        });
      });
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== 'secret') {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) };
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterableIterator('BOOK_ADDED'),
    },
  },
};
module.exports = resolvers;
