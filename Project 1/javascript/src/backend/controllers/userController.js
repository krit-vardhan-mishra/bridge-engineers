const { BlogApp } = require('./models');

const app = new BlogApp();
function createUser(reqBody) {
  const { name, age } = reqBody;
  if (!name || age === undefined) {
    return { success: false, message: "Name and age are required." };
  }
  const user = app.createUser(name, age);
  return { success: true, user };
}

function getAllUsers() {
  return app.getAllUsers();
}

function getUserById(userId) {
  const user = app.getUserById(userId);
  if (!user) {
    return { success: false, message: "User not found." };
  }
  return { success: true, user };
}

function getUsersWithBlogs() {
  return app.getUsersWithBlogs();
}

function getUsersWithoutBlogs() {
  return app.getUsersWithoutBlogs();
}

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  getUsersWithBlogs,
  getUsersWithoutBlogs,
  app
};
