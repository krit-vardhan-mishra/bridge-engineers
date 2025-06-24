class User {
  constructor(name, age) {
    this.id = null;
    this.name = name || 'Anonymous';
    this.age = age || 0;
    this.blogs = [];
  }

  getName() {
    return this.name;
  }

  setName(name) {
    this.name = name;
  }

  getAge() {
    return this.age;
  }

  setAge(age) {
    this.age = age;
  }

  getBlogsCount() {
    return this.blogs.length;
  }

  getAllBlogs() {
    return this.blogs;
  }

  getBlogById(id) {
    return this.blogs.find(blog => blog.getId() === id) || null;
  }

  deleteBlogById(id) {
    const index = this.blogs.findIndex(blog => blog.getId() === id);
    if (index !== -1) {
      this.blogs.splice(index, 1);
      return true;
    }
    return false;
  }

  canPostBlog() {
    return this.age >= 13;
  }

  createBlog(title, content, blogId) {
    const newBlog = new Blog(blogId, title, content, this.name);
    this.blogs.push(newBlog);
    return newBlog.getId();
  }

  editBlog(id) {
    return this.getBlogById(id);
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      age: this.age,
      blogs: this.blogs.map(blog => blog.toJSON())
    };
  }
}
