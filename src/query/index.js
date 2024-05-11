const { mergeSchemas } = require('@graphql-tools/schema')
const { bookSchema } = require('./books');
const { userSchema } = require('./users');
const { authorSchema } = require('./authors');

const schema = mergeSchemas({
    schemas: [
      bookSchema,
      authorSchema
      // Add other schemas here
    ]
  });
  const user_schema = mergeSchemas({
    schemas: [
      userSchema
      // Add other schemas here
    ]
  });
  module.exports = {schema,user_schema}
  