const {
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLSchema,
  } = require('graphql');
const { User } = require('../models');
const { UserInputType } = require('../types');

const UserMutationType = new GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
      singUp: {
        type: Object,
        args: {
          user: { type: new GraphQLNonNull(UserInputType) }
        },
        resolve: async (parent, args, context, info) => {
          // Resolve logic to add a new book
          // For simplicity, we'll return the input data
          let userDetails = args.user
          User.insertMany(userDetails).then(res=>{
            delete res[0].password;
            return res[0]
          }).catch(err=>{
            throw new Error(err)
          })
        }
      },
      login: {
        type: Object,
        args: {
          user: { type: new GraphQLNonNull(UserInputType) }
        },
        resolve: async (parent, args, context, info) => {
          // Resolve logic to add a new author
          // For simplicity, we'll return the input data
            const user = await User.findOne({ username: args.user.username });

            // Check if user exists and password is correct
            if (!user || !user.comparePassword(password)) {
            return res.status(401).json({ message: 'Invalid username or password' });
            }

            // Generate JWT token
            const token = jwt.sign({ userId: user._id }, secret, { expiresIn: '1h' });

            // Respond with token
            return {"token":token}
        }
      }
    })
  });

  const userSchema = new GraphQLSchema({
    mutation: UserMutationType
  });
  module.exports = { userSchema };
