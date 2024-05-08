const { mergeSchemas } = require('@graphql-tools/schema')
const { bookSchema } = require('./books');
const { userSchema } = require('./users');
const { authorSchema } = require('./authors');

const schema = mergeSchemas({
    schemas: [
      bookSchema,
      userSchema,
      authorSchema
      // Add other schemas here
    ]
  });

  module.exports = {schema}
  