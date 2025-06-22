const Blog = require('./Blog');

class User {
    static blogIdCounter = 0;

    constructor(name, age) {
        this.name = name;
        this.age = age || '';
        this.blogs = [];
    }

    getBlogsCount() {
        return this.blogs.length;
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

    createBlog(title, content) {
        const newBlog = new Blog(++User.blogIdCounter, title, content, this.name);
        this.blogs.push(newBlog);
        return newBlog.getId();
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
        return this.blogs.length > 0;
    }

    getAllBlogs() {
        return this.blogs;
    }

    editBlog(id) {
        return this.getBlogById(id);
    }
}

module.exports = User;