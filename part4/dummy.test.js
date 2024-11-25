const { test, describe } = require('node:test');
const assert = require('node:assert');
const { dummy, totalLikes, favoriteBlog } = require('./utils/list_helper');

const mockBlogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0,
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0,
  },
];
test('dummy returns one', () => {
  const result = dummy(mockBlogs);
  assert.strictEqual(result, 1);
});

describe('total likes', () => {
  test('when list has only one blog, equals the likes of that', () => {
    const result = totalLikes([mockBlogs[0]]);
    assert.strictEqual(result, 7);
  });
});

describe('favorite blog', () => {
  test('return blog with most likes', () => {
    const result = favoriteBlog(mockBlogs);
    assert.deepStrictEqual(result, {
      title: 'React patterns',
      author: 'Michael Chan',
      likes: 7,
    });
  });
});
