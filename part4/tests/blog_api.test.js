const { test, after, beforeEach, describe } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const bcrypt = require('bcryptjs');
const api = supertest(app);

const helper = require('./test_helper');
const Blog = require('../models/blog');
const User = require('../models/user');

let mockBlogs;
beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});
  const passwordHash = await bcrypt.hash('secret', 10);
  const user = new User({ username: 'root', passwordHash });

  const savedUser1 = await user.save();

  const user2 = new User({ username: 'root2', passwordHash });

  const savedUser2 = await user2.save();
  mockBlogs = [
    {
      _id: '5a422a851b54a676234d17f7',
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 7,
      user: savedUser1.id,
      __v: 0,
    },
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      user: savedUser1.id,
      __v: 0,
    },
    {
      _id: '5a422b3a1b54a676234d17f9',
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12,
      user: savedUser1.id,
      __v: 0,
    },
    {
      _id: '5a422b891b54a676234d17fa',
      title: 'First class tests',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
      likes: 10,
      user: savedUser2.id,
      __v: 0,
    },
    {
      _id: '5a422ba71b54a676234d17fb',
      title: 'TDD harms architecture',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
      likes: 0,
      user: savedUser2.id,
      __v: 0,
    },
    {
      _id: '5a422bc61b54a676234d17fc',
      title: 'Type wars',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
      likes: 2,
      user: savedUser2.id,
      __v: 0,
    },
  ];
  const blogObjects = mockBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
});
describe('api returns correct format', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('returns id on get', async () => {
    const response = await api.get('/api/blogs');
    assert('id' in response.body[0]);
  });
});

describe('saving new blogs', () => {
  test('a valid blog can be added ', async () => {
    const newBlog = {
      title: 'Mock title Test',
      author: 'super tester',
      url: 'https://google.com',
      likes: 5,
    };
    const { token } = await helper.login('root', 'secret');
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const response = await api.get('/api/blogs');

    const contents = response.body.map((r) => r.title);

    assert.strictEqual(response.body.length, mockBlogs.length + 1);

    assert(contents.includes('Mock title Test'));
  });

  test('likes defaults to 0 if not passed', async () => {
    const newBlog = {
      title: 'Mock title Test',
      author: 'super tester',
      url: 'https://google.com',
    };
    const { token } = await helper.login('root', 'secret');
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const response = await api.get('/api/blogs');

    const likes = response.body.map((r) => r.likes);

    assert.strictEqual(response.body.length, mockBlogs.length + 1);
    assert(likes[mockBlogs.length] === 0);
  });

  test('returns 400 Bad Request if title or url is empty', async () => {
    const newBlog = {
      title: '',
      author: 'super tester',
      url: '',
    };

    const { token } = await helper.login('root', 'secret');
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)
      .expect('Content-Type', /application\/json/);
  });
});

describe('delete blog tests', () => {
  test('delete a blog and get status 204 and data is deleted', async () => {
    const id = '5a422a851b54a676234d17f7';
    const { token } = await helper.login('root', 'secret');
    await api
      .delete(`/api/blogs/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204);

    const response = await api.get('/api/blogs');
    assert.strictEqual(response.body.length, mockBlogs.length - 1);
  });
});

describe('update blog tests', () => {
  test('update like for a blog', async () => {
    const id = '5a422a851b54a676234d17f7';
    const updatedBlog = {
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 10,
    };
    await api.put(`/api/blogs/${id}`).send(updatedBlog);

    const response = await api.get('/api/blogs');
    assert.strictEqual(response.body.length, mockBlogs.length);
    const blogToCheck = response.body.find((blog) => blog.id === id);
    assert(blogToCheck.likes === 10);
  });
});

after(async () => {
  await User.deleteMany({});
  await mongoose.connection.close();
});
