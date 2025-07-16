import { BlogApp } from './models';
import { readFileSync } from 'fs';
import { join } from 'path';

const app = new BlogApp();

// Initialize data from JSON files
function initializeData() {
  const usersPath = join(__dirname, 'data', 'users.json');
  const blogsPath = join(__dirname, 'data', 'blogs.json');

  const usersData = JSON.parse(readFileSync(usersPath, 'utf8'));
  const blogsData = JSON.parse(readFileSync(blogsPath, 'utf8'));

  // Load users into BlogApp
  usersData.forEach(user => {
    const newUser = app.createUser(user.name, user.age);
    newUser.id = user.id; // Preserve original ID
  });

  // Load blogs into users
  blogsData.forEach(blog => {
    const user = app.getUserById(blog.userId);
    if (user) {
      user.createBlog(blog.title, blog.content, blog.id);
    }
  });
}

initializeData(); // Call on startup

// Existing controller functions...
module.exports = { /* ... */ };