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
  }
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

// Create the User model
const User = mongoose.model('User', userSchema);



module.exports = {Book,Author,User}