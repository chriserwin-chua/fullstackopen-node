const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const blogSchema = new Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
});

module.exports = model('Blog', blogSchema);
