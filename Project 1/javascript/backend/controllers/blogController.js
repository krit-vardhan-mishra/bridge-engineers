const { app } = require('./userController'); 

/**
 * Creates a new blog post for a specific user.
 * @param {object} reqBody - Request body containing blog details.
 * @param {number} reqBody.userId - The ID of the user creating the blog.
 * @param {string} reqBody.title - The title of the blog post.
 * @param {string} reqBody.content - The content of the blog post.
 * @returns {object} Result object indicating success and the new blog's ID (or error message).
 */
function createBlog(reqBody) {
  const { userId, title, content } = reqBody;

  if (!userId || !title || !content) {
    return { success: false, message: "User ID, title, and content are required." };
  }

  const blogId = app.createBlogForUser(parseInt(userId), title, content);

  if (!blogId) {
    return { success: false, message: "Blog could not be created. User may not exist or is not eligible (age < 13)." };
  }

  return { success: true, blogId };
}

/**
 * Retrieves all blog posts from all users.
 * @returns {Array<Blog>} An array of all blog objects.
 */
function getAllBlogs() {
  return app.getAllBlogs();
}

/**
 * Retrieves a single blog post by its ID.
 * @param {number} blogId - The ID of the blog post.
 * @returns {object} Result object indicating success and the blog (or error message).
 */
function getBlogById(blogId) {
  const blog = app.getBlogById(blogId);
  if (!blog) {
    return { success: false, message: "Blog not found." };
  }
  return { success: true, blog };
}

/**
 * Deletes a blog post by its ID for a specific user.
 * @param {number} userId - The ID of the user who owns the blog.
 * @param {number} blogId - The ID of the blog post to delete.
 * @returns {object} Result object indicating success (or error message).
 */
function deleteBlog(userId, blogId) {
  const user = app.getUserById(userId);
  if (!user) {
      return { success: false, message: "User not found." };
  }

  const success = user.deleteBlogById(blogId);
  if (!success) {
      return { success: false, message: "Blog not found or could not be deleted." };
  }

  return { success: true, message: "Blog deleted." };
}

module.exports = {
  createBlog,
  getAllBlogs,
  getBlogById,
  deleteBlog
};
