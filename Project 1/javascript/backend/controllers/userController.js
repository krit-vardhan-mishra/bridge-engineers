const { BlogApp } = require('../models/BlogApp'); 

let appInstance = new BlogApp();

/**
 * Allows the server to set the fully initialized BlogApp instance.
 * @param {BlogApp} newApp The initialized BlogApp instance.
 */
function setApp(newApp) {
    appInstance = newApp;
}

/**
 * Creates a new user.
 * @param {object} reqBody - Request body containing user details.
 * @param {string} reqBody.name - The name of the user.
 * @param {number} reqBody.age - The age of the user.
 * @returns {object} Result object indicating success and the created user (or error message).
 */
function createUser(reqBody) {
  const { name, age } = reqBody;
  if (!name || age === undefined) {
    return { success: false, message: "Name and age are required." };
  }
  const user = appInstance.createUser(name, age);
  return { success: true, user };
}

/**
 * Retrieves all users.
 * @returns {Array<User>} An array of all user objects.
 */
function getAllUsers() {
  return appInstance.getAllUsers();
}

/**
 * Retrieves a user by their ID.
 * @param {number} userId - The ID of the user.
 * @returns {object} Result object indicating success and the user (or error message).
 */
function getUserById(userId) {
  const user = appInstance.getUserById(userId);
  if (!user) {
    return { success: false, message: "User not found." };
  }
  return { success: true, user };
}

/**
 * Retrieves users who have posted blogs.
 * @returns {Array<User>} An array of users with blogs.
 */
function getUsersWithBlogs() {
  return appInstance.getUsersWithBlogs();
}

/**
 * Retrieves users who have not posted any blogs.
 * @returns {Array<User>} An array of users without blogs.
 */
function getUsersWithoutBlogs() {
  return appInstance.getUsersWithoutBlogs();
}

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  getUsersWithBlogs,
  getUsersWithoutBlogs,
  app: appInstance,
  setApp
};
