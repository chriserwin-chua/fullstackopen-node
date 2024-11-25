const Blog = require('../models/blog');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const nonExistingId = async () => {
  const blog = new Blog({
    title: 'randomstuff',
    author: 'randomstuff',
    url: 'https://google.com',
    likes: 5,
  });
  await blog.save();
  await blog.deleteOne();

  return blog._id.toString();
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

const login = async (username, password) => {
  const user = await User.findOne({ username });
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    return 'incorrect credentials';
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  };

  const token = jwt.sign(userForToken, process.env.JWT_SECRET);
  return { token, id: user._id };
};
module.exports = {
  nonExistingId,
  blogsInDb,
  usersInDb,
  login,
};
