const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLList,
    GraphQLNonNull,
    GraphQLInputObjectType
  } = require('graphql');

const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
      id: { type: GraphQLID },
      title: { type: GraphQLString },
      author: { type: GraphQLString },
      genre: { type: GraphQLString }
    })
  });
  
  // Define the Author type
  const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
      id: { type: GraphQLID },
      name: { type: GraphQLString },
      books: {
        type: new GraphQLList(BookType),
      }
    })
  });

  const BookInputType = new GraphQLInputObjectType({
    name: 'BookInput',
    fields: () => ({
      title: { type: new GraphQLNonNull(GraphQLString) },
      author: { type: new GraphQLNonNull(GraphQLID) },
      genre: { type: GraphQLString }
    })
  });
  
  const AuthorInputType = new GraphQLInputObjectType({
    name: 'AuthorInput',
    fields: () => ({
      name: { type: new GraphQLNonNull(GraphQLString) }
    })
  });

  const UserInputType = new GraphQLInputObjectType({
    name: "UserInput",
    fields: ()=>({
      username: { type: new GraphQLNonNull(GraphQLString) },
      password: { type: new GraphQLNonNull(GraphQLString) }
    })
  })

  const UserType = new GraphQLObjectType({
    name: "User",
    fields: ()=>({
      username: { type: GraphQLString },
      id: { type: GraphQLID },
    })
  })
  const TokenType = new GraphQLObjectType({
    name: "Token",
    fields: ()=>({
      token: { type: GraphQLString },
    })
  })

  module.exports = {BookType,BookInputType,AuthorInputType,AuthorType,UserType,UserInputType,TokenType}