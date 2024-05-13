const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author' },
  genre: String
});

const Book = mongoose.model('Book', bookSchema);



const authorSchema = new mongoose.Schema({
  name: String
});


authorSchema.virtual('books', {
    ref: 'Book', // The model to use for populating
    localField: '_id', // Field in the current model
    foreignField: 'author', // Field in the referenced model
    justOne: false // Set to false to populate all books, true to populate just one book
  });
  
const Author = mongoose.model('Author', authorSchema);


const bcrypt = require('bcrypt');

const permissionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String }
  // Other fields as needed
});

// Define the schema for the user model
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Permission' }]
});

// Hash the password before saving the user
userSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) {
      return next();
    }
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

userSchema.methods.hasPermission = function(permissionName) {
  return this.populate('permissions').execPopulate().then(user => {
    // Check if the user has the permission with the specified name
    return user.permissions.some(permission => permission.name === permissionName);
  });
};

const bookIssuanceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user who issued the book
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true }, // Reference to the book being issued
  issueDate: { type: Date, default: Date.now }, // Date when the book was issued
  returnDate: { type: Date } // Date when the book is expected to be returned
  // Other fields as needed
});

// Create the book issuance model
const BookIssuance = mongoose.model('BookIssuance', bookIssuanceSchema);

// Create the User model
const User = mongoose.model('User', userSchema);

const Permission = mongoose.model('Permission', permissionSchema);

module.exports = {Book,Author,User,BookIssuance}