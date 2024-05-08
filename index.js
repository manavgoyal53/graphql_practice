const express = require('express');
const {schema} = require('./src/query/index');
const {graphqlHTTP} = require('express-graphql');
const {authMiddleware} = require("./src/authMiddleware");
const { connectDB } = require('./connectDB');


const app = express();
app.use(authMiddleware);

// Mount the GraphQL endpoint
// app.all('/graphql', createHandler({ schema }));

app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: false // Enable GraphiQL for easy testing
  }));


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    await connectDB();
    console.log(`Server running on port ${PORT}`);
});
