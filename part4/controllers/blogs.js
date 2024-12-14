const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user');
  response.json(blogs);
});

blogsRouter.post('/', async (request, response) => {
  if (request.body.title === '' || request.body.url === '') {
    return response.status(400).json('Missing contents.');
  }

  const blog = new Blog({ ...request.body, user: request.user.id });
  const result = await blog.save();
  request.user.blogs = request.user.blogs.concat(result._id);
  await request.user.save();
  response.status(201).json(result);
});

blogsRouter.put('/:id', async (request, response) => {
  const id = request.params.id;
  const { title, author, url, likes } = request.body;
  const blog = {
    title,
    author,
    url,
    likes,
  };
  const updatedBlog = await Blog.findByIdAndUpdate(id, blog, {
    new: true,
    runValidators: true,
    context: 'query',
  });

  response.json(updatedBlog);
});

blogsRouter.put('/:id/comments', async (request, response) => {
  const id = request.params.id;
  const { title, author, url, likes, comments } = request.body;
  const blog = {
    title,
    author,
    url,
    likes,
    comments,
  };
  const updatedBlog = await Blog.findByIdAndUpdate(id, blog, {
    new: true,
    runValidators: true,
    context: 'query',
  });

  response.json(updatedBlog);
});

blogsRouter.delete('/:id', async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.JWT_SECRET); //token comes from middleware
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' });
  }
  const user = await User.findById(decodedToken.id);
  const id = request.params.id;
  const blog = await Blog.findById(id).populate('user');
  if (blog.user.id === user.id) {
    await Blog.findByIdAndDelete(id);
    response.status(204).end();
  } else {
    response.status(401).json({ error: 'user not authorized to delete' });
  }
});

module.exports = blogsRouter;
