const { app } = require('./userController'); 

function createBlog(reqBody) {
  const { userId, title, content } = reqBody;

  if (!userId || !title || !content) {
    return { success: false, message: "User ID, title, and content are required." };
  }

  const blogId = app.createBlogForUser(userId, title, content);

  if (!blogId) {
    return { success: false, message: "Blog could not be created. User may not exist or is not eligible." };
  }

  return { success: true, blogId };
}

// Get all blogs
function getAllBlogs() {
  return app.getAllBlogs();
}

// Get blog by ID
function getBlogById(blogId) {
  const blog = app.getBlogById(blogId);
  if (!blog) {
    return { success: false, message: "Blog not found." };
  }
  return { success: true, blog };
}

// Delete blog by ID
function deleteBlog(userId, blogId) {
  const user = app.getUserById(userId);
  if (!user) return { success: false, message: "User not found." };

  const success = user.deleteBlogById(blogId);
  if (!success) return { success: false, message: "Blog not found or could not be deleted." };

  return { success: true, message: "Blog deleted." };
}

module.exports = {
  createBlog,
  getAllBlogs,
  getBlogById,
  deleteBlog
};
