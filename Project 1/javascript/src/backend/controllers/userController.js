// userController.js
const { BlogApp } = require('./models');

// Single instance of BlogApp for this app
const app = new BlogApp();

// Create a new user
function createUser(reqBody) {
  const { name, age } = reqBody;
  if (!name || age === undefined) {
    return { success: false, message: "Name and age are required." };
  }
  const user = app.createUser(name, age);
  return { success: true, user };
}

// Get all users
function getAllUsers() {
  return app.getAllUsers();
}

// Get user by ID
function getUserById(userId) {
  const user = app.getUserById(userId);
  if (!user) {
    return { success: false, message: "User not found." };
  }
  return { success: true, user };
}

// Get users with blogs
function getUsersWithBlogs() {
  return app.getUsersWithBlogs();
}

// Get users without blogs
function getUsersWithoutBlogs() {
  return app.getUsersWithoutBlogs();
}

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  getUsersWithBlogs,
  getUsersWithoutBlogs,
  app // Exporting for use in blogController.js
};
