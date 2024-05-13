const {
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLSchema,
    GraphQLList
  } = require('graphql');

const { User } = require('../models');
const { UserInputType,UserType,TokenType } = require('../types');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config.js'); // Your secret key for JWT


const UserMutationType = new GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
      singUp: {
        type: UserType,
        description:"Used for creating a user",
        args: {
          user: { type: new GraphQLNonNull(UserInputType) }
        },
        resolve: async (parent, args, context, info) => {
          // Resolve logic to add a new book
          // For simplicity, we'll return the input data
          let userDetails = args.user
          return await User.create(userDetails).then((res)=>{
            delete res.password;
            return res
          }).catch(err=>{
            throw new Error(err)
          })
        }
      },
      login: {
        type: TokenType,
        description:"Used for fetching token for a user",
        args: {
          user: { type: new GraphQLNonNull(UserInputType) }
        },
        resolve: async (parent, args, context, info) => {
          // Resolve logic to add a new author
          // For simplicity, we'll return the input data
            const user = await User.findOne({ username: args.user.username });
            // Check if user exists and password is correct
            if (!user || !user.comparePassword(args.user.password)) {
            return { message: 'Invalid username or password' };
            }

            // Generate JWT token
            const token = jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: '1h' });

            // Respond with token
            return {"token":token}
        }
      }
    })
  });

  const UserQueryType = new GraphQLObjectType({
    name: 'Query',
    fields: {
      users: {
        type: new GraphQLList(UserType),
        resolve: async (parent, args, context, resolveInfo) => {
            return await User.find().exec()
            }
      },
    }
  });

  const userSchema = new GraphQLSchema({
    mutation: UserMutationType,
    query: UserQueryType
  });
  module.exports = { userSchema };
