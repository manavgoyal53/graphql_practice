const {
    GraphQLObjectType,
    GraphQLList,
    GraphQLNonNull,
    GraphQLSchema,
  } = require('graphql');

const { Book } = require('../models');
const {BookInputType,BookType,IdType} = require("../types");
  
  // Define the Book type
  

  const BookQueryType = new GraphQLObjectType({
    name: 'Query',
    fields: {
      books: {
        type: new GraphQLList(BookType),
        resolve: async (parent, args, context, resolveInfo) => {
          console.log(resolveInfo.fieldNodes[0].selectionSet.selections[2].directives);
            return await Book.find().populate('author').exec().then(res=>{
              console.log(res)
              res.forEach(element => {
                element.author = element.author.name
              });
              return res
            })
            }
      },
    }
  });
  
  // Define input types for mutations
  
  
  // Define mutations
  const BookMutationType = new GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
      addBook: {
        type: BookType,
        args: {
          book: { type: new GraphQLNonNull(BookInputType) }
        },
        resolve: async (parent, args, context, info) => {
          // Resolve logic to add a new book
          // For simplicity, we'll return the input data
          return await Book.insertMany(args.book).then((res)=>{
            return res[0];
          }).catch(err=>{
            throw new Error(err)
          })
        }
      },
      deleteBook:{
        type: BookType,
        args: {
          book: {type: IdType}
        },
        resolve: async (parents,args,context,resolveinfo)=>{
          return await Book.findByIdAndDelete(args.book.id).exec().then(res=>{
            console.log(res)
            return res
          })
        }
      }
    })
  });
  const bookSchema = new GraphQLSchema({
    query: BookQueryType,
    mutation: BookMutationType,
    types: [BookInputType,BookType]
  });
  
  // Export the types and mutations
  module.exports = { bookSchema };
  