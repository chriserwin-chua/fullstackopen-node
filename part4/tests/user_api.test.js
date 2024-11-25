const bcrypt = require('bcryptjs');
const { test, after, beforeEach, describe } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');

const api = supertest(app);

const helper = require('./test_helper');
const User = require('../models/user');
describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('secret', 10);
    const user = new User({ username: 'root', passwordHash });

    await user.save();
  });

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'testusername',
      name: 'Test User',
      password: 'test123456',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    assert(usernames.includes(newUser.username));
  });

  test('create user fails on existing user', async () => {
    const newUser = {
      username: 'root',
      name: 'Test User',
      password: 'test123456',
    };

    await api.post('/api/users').send(newUser).expect(400);
  });

  test('create fails on invalid input', async () => {
    const newUser = {
      username: 'te',
      name: 'Test User',
      password: 'test123456',
    };

    await api.post('/api/users').send(newUser).expect(400);
  });
});
after(async () => {
  await mongoose.connection.close();
});
