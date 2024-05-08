const {
    GraphQLObjectType,
    GraphQLList,
    GraphQLNonNull,
    GraphQLSchema,
  } = require('graphql');

const { Author } = require('../models');
const {AuthorInputType,AuthorType} = require("../types");
const AuthorQueryType = new GraphQLObjectType({
    name: 'Query',
    fields: {
      authors: {
        type: new GraphQLList(AuthorType),
        resolve: async(parent, args, context, info) => {
          let fields = [];
          info.fieldNodes[0].selectionSet.selections.forEach((el=>{
            fields.push(el.name.value)
          }))
          let query = Author.find()
          if(fields.includes("books")){
            query = query.populate("books")
          }
          return await query.exec();
        }
      }
    }
  });

  const AuthorMutationType = new GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
      addAuthor: {
        type: AuthorType,
        args: {
          author: { type: new GraphQLNonNull(AuthorInputType) }
        },
        resolve: async (parent, args, context, info) => {
          // Resolve logic to add a new author
          // For simplicity, we'll return the input data
          return await Author.insertMany(args.author).then((res)=>{
            return res[0]
          }).catch(err=>{
            throw new Error("unable to add author!")
          })
        }
      }
    })
  });

  const authorSchema = new GraphQLSchema({
    query: AuthorQueryType,
    mutation: AuthorMutationType
  });

  module.exports = {authorSchema}