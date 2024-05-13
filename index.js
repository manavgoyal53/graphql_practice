const express = require('express');
const {schema,user_schema} = require('./src/query/index');
const {graphqlHTTP} = require('express-graphql');
const {authMiddleware} = require("./src/authMiddleware");
const { connectDB } = require('./connectDB');


const app = express();

// Mount the GraphQL endpoint
// app.all('/graphql', createHandler({ schema }));

app.use('/graphql', authMiddleware, graphqlHTTP({
    schema: schema,
    graphiql: false // Enable GraphiQL for easy testing
  }));


const loginSignUphandler = graphqlHTTP({
  schema: user_schema,
  graphiql: false // Enable GraphiQL for easy testing
})
app.use('/login_signup', loginSignUphandler);


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    await connectDB();
    console.log(`Server running on port ${PORT}`);
});
