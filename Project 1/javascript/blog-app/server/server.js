import express from 'express';
import { getAllUsers } from './userController';
import { getAllBlogs } from './blogController';

const app = express();
app.use(require('cors')());

// Use controller functions
app.get('/api/users', (req, res) => {
  res.json(getAllUsers());
});

app.get('/api/blogs', (req, res) => {
  res.json(getAllBlogs());
});

app.listen(5000, () => {
  console.log('Backend server running at http://localhost:5000');
});