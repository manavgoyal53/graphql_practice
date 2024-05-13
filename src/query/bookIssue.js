const {
    GraphQLObjectType,
    GraphQLList,
    GraphQLSchema,
  } = require('graphql');

const {BookIssuance} = require("../models");
const {BookIssueInputType, IdType, BookIssueType} = require("../types");

const BookIssueQuery = new GraphQLObjectType({
    name: 'Query',
    fields:()=> ({
        issuedBooks: {
        type: new GraphQLList(BookIssueType),
        resolve: async () => {
            try {
              const issuedBooks = await BookIssuance.find().populate('user').populate('book');
              return issuedBooks;
            } catch (error) {
              console.error('Error fetching issued books:', error);
              throw error;
            }
          },
        },
        issuedBooksByUser: {
            type: GraphQLList(BookIssueType),
            args: {userId:{type:IdType}},
            resolve: async (parent, args,context, resolveInfo) => {
                try {
                  const issuedBooks = await BookIssuance.find({ user: args.userId.id }).populate('user').populate('book');
                  return issuedBooks;
                } catch (error) {
                  console.error('Error fetching issued books by user:', error);
                  throw error;
                }
              }
                
            }
        })
  });

const BookIssueMutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: ()=>({
        issueBook: {
            type: BookIssueType,
            args:{
                bookIssueInfo:{type:BookIssueInputType}
            },
            resolve: async (parent,args,context,resolveInfo) => {
                try {
                    const issuance = new BookIssuance({
                        user: args.bookIssueInfo.user,
                        book: args.bookIssueInfo.book,
                        issueDate: new Date(),
                    });
                    await issuance.save();
                } catch (error) {
                    console.error('Error fetching issued books:', error);
                    throw error;
                }
            }
        },
        returnBook: {
            type: BookIssueType,
            args:{issuanceId:{type:IdType}},
            resolve: async (parent, args,context, resolveInfo) => {
                try {
                    // Find the book issuance record by ID
                    const issuance = await BookIssuance.findById(args.issuanceId.id);
                    if (!issuance) {
                      throw new Error('Book issuance not found');
                    }
            
                    // Update the return date to mark the book as returned
                    issuance.returnDate = new Date();
                    await issuance.save();
                    return issuance;
                  } catch (error) {
                    console.error('Error returning book:', error);
                    throw error;
                  }
                
            }
        }
    })
  });


  const bookIssueSchema = new GraphQLSchema({
    query: BookIssueQuery,
    mutation: BookIssueMutation
  })

  module.exports = {bookIssueSchema}