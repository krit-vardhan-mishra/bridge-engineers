import { app } from './userController';

function getAllBlogs() {
  return app.getAllBlogs().map(blog => ({
    id: blog.id,
    title: blog.title,
    content: blog.content,
    author: blog.author,
    userId: blog.userId
  }));
}

// Update other functions similarly
export default { getAllBlogs, /* ... */ };