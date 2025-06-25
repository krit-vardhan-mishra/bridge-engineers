const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 5000;

app.get('/api/users', (req, res) => {
  const usersPath = path.join(__dirname, 'data', 'users.json');
  fs.readFile(usersPath, 'utf8', (err, data) => {
    if (err) return res.status(500).send("Error reading users.json");
    res.json(JSON.parse(data));
  });
});

app.get('/api/blogs', (req, res) => {
  const blogsPath = path.join(__dirname, 'data', 'blogs.json');
  fs.readFile(blogsPath, 'utf8', (err, data) => {
    if (err) return res.status(500).send("Error reading blogs.json");
    res.json(JSON.parse(data));
  });
});

app.use(require('cors')());

app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
});
