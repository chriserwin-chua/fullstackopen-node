const dummy = (blogs) => {
  console.log(blogs);
  return 1;
};

const totalLikes = (blogs) => {
  if (blogs.length === 1) {
    return blogs[0].likes;
  }
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 1) {
    return {
      title: blogs[0].title,
      author: blogs[0].author,
      likes: blogs[0].likes,
    };
  }
  let topLikes = 0;
  blogs.forEach((blog) => {
    if (blog.likes > topLikes) {
      topLikes = blog.likes;
    }
  });
  const favoriteBlog = blogs.find((blog) => blog.likes === topLikes);
  return {
    title: favoriteBlog.title,
    author: favoriteBlog.author,
    likes: favoriteBlog.likes,
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};
