import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import { UserService } from './services/userService.js';
import { BlogService } from './services/blogService.js';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Connect to the database before starting the server
await connectDB();

// --- API Routes for Users ---

// Get all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await UserService.getAllUsers();
    res.json(users);
  } catch (error) {
    // Handle server errors
    res.status(500).json({ message: error.message });
  }
});

// Get a user by ID
app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await UserService.getUserById(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new user
app.post('/api/users', async (req, res) => {
  try {
    const { name, age } = req.body;
    const user = await UserService.createUser(name, age);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update an existing user by ID
app.put('/api/users/:id', async (req, res) => {
  try {
    const user = await UserService.updateUser(req.params.id, req.body);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a user by ID
app.delete('/api/users/:id', async (req, res) => {
  try {
    await UserService.deleteUser(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- API Routes for Blogs ---

// Get all blogs
app.get('/api/blogs', async (req, res) => {
  try {
    const blogs = await BlogService.getAllBlogs();
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a blog by ID
app.get('/api/blogs/:id', async (req, res) => {
  try {
    const blog = await BlogService.getBlogById(req.params.id);
    if (blog) {
      res.json(blog);
    } else {
      res.status(404).json({ message: "Blog not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new blog
app.post('/api/blogs', async (req, res) => {
  try {
    const { title, content, authorId } = req.body;
    const blog = await BlogService.createBlog({ title, content, authorId });
    res.status(201).json(blog); 
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update an existing blog by ID
app.put('/api/blogs/:id', async (req, res) => {
  try {
    const { title, content } = req.body;
    const blogId = req.params.id;
    
    let updated = false;
    if (title !== undefined) {
      updated = await BlogService.updateBlogTitle(blogId, title) || updated;
    }
    if (content !== undefined) {
      updated = await BlogService.updateBlogContent(blogId, content) || updated;
    }

    if (updated) {
      const blog = await BlogService.getBlogById(blogId);
      res.json(blog);
    } else {
      res.status(400).json({ message: "No valid updates provided" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a blog by ID
app.delete('/api/blogs/:id', async (req, res) => {
  try {
    const success = await BlogService.deleteBlog(req.params.id);
    if (success) {
      res.json({ message: "Blog deleted successfully" });
    } else {
      res.status(404).json({ message: "Blog not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
