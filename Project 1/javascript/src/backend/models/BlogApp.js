class BlogApp {
  constructor() {
    this.users = [];
    this.blogIdCounter = 0;
    this.userIdCounter = 0;
  }

  createUser(name, age) {
    const newUser = new User(name, age);
    newUser.id = ++this.userIdCounter;
    this.users.push(newUser);
    return newUser;
  }

  getUserById(userId) {
    return this.users.find(user => user.id === userId) || null;
  }

  getUserByName(name) {
    return this.users.find(user => user.name === name) || null;
  }

  getAllUsers() {
    return this.users;
  }

  createBlogForUser(userId, title, content) {
    const user = this.getUserById(userId);
    if (user && user.canPostBlog()) {
      return user.createBlog(title, content, ++this.blogIdCounter);
    }
    return null;
  }

  getAllBlogs() {
    const allBlogs = [];
    this.users.forEach(user => {
      allBlogs.push(...user.getAllBlogs());
    });
    return allBlogs;
  }

  getBlogById(blogId) {
    for (const user of this.users) {
      const blog = user.getBlogById(blogId);
      if (blog) return blog;
    }
    return null;
  }

  getUsersWithBlogs() {
    return this.users.filter(user => user.getBlogsCount() > 0);
  }

  getUsersWithoutBlogs() {
    return this.users.filter(user => user.getBlogsCount() === 0);
  }
}

module.exports = {
  Blog,
  User,
  BlogApp
};