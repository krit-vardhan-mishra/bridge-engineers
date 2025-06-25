const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const userController = require('./controllers/userController');
const blogController = require('./controllers/blogController');

const { BlogApp, User, Blog } = require('./models/BlogApp');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const initializeBlogApp = () => {
    const dataDirPath = path.join(__dirname, 'data');
    const usersPath = path.join(dataDirPath, 'users.json');
    const blogsPath = path.join(dataDirPath, 'blogs.json');

    if (!fs.existsSync(dataDirPath)) {
        fs.mkdirSync(dataDirPath);
    }
    if (!fs.existsSync(usersPath)) {
        fs.writeFileSync(usersPath, '[]', 'utf8');
    }
    if (!fs.existsSync(blogsPath)) {
        fs.writeFileSync(blogsPath, '[]', 'utf8');
    }

    const usersData = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
    const blogsData = JSON.parse(fs.readFileSync(blogsPath, 'utf8'));

    const blogAppInstance = new BlogApp();

    let maxUserId = 0;
    usersData.forEach(userData => {
        const user = blogAppInstance.createUser(userData.name, userData.age);
        user.id = userData.id;
        if (userData.id > maxUserId) {
            maxUserId = userData.id;
        }
    });
    blogAppInstance.userIdCounter = maxUserId; 
    let maxBlogId = 0;
    blogsData.forEach(blogData => {
        const user = blogAppInstance.getUserById(blogData.userId);
        if (user) {
            const newBlog = new Blog(blogData.id, blogData.title, blogData.content, blogData.author);
            newBlog.setUserId(blogData.userId); 
            user.blogs.push(newBlog);
            if (blogData.id > maxBlogId) {
                maxBlogId = blogData.id;
            }
        } else {
            console.warn(`Blog ID ${blogData.id} has no matching user (ID: ${blogData.userId}). Skipping.`);
        }
    });
    blogAppInstance.blogIdCounter = maxBlogId;
    
    userController.setApp(blogAppInstance);

    console.log("BlogApp initialized with data.");
    console.log(`Loaded ${blogAppInstance.getAllUsers().length} users and ${blogAppInstance.getAllBlogs().length} blogs.`);
};

initializeBlogApp();

app.get('/api/users', (req, res) => {
    res.json(userController.getAllUsers().map(user => user.toJSON()));
});

app.get('/api/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const result = userController.getUserById(userId);
    if (result.success) {
        res.json(result.user.toJSON());
    } else {
        res.status(404).json({ message: result.message });
    }
});

app.post('/api/users', (req, res) => {
    const result = userController.createUser(req.body);
    if (result.success) {
        res.status(201).json(result.user.toJSON());
    } else {
        res.status(400).json({ message: result.message });
    }
});

app.get('/api/blogs', (req, res) => {
    res.json(blogController.getAllBlogs().map(blog => blog.toJSON()));
});

app.get('/api/blogs/:id', (req, res) => {
    const blogId = parseInt(req.params.id);
    const result = blogController.getBlogById(blogId);
    if (result.success) {
        res.json(result.blog.toJSON());
    } else {
        res.status(404).json({ message: result.message });
    }
});

app.post('/api/blogs', (req, res) => {
    const result = blogController.createBlog(req.body);
    if (result.success) {
        res.status(201).json({ message: "Blog created successfully", blogId: result.blogId });
    } else {
        res.status(400).json({ message: result.message });
    }
});

app.delete('/api/blogs/:userId/:blogId', (req, res) => {
    const userId = parseInt(req.params.userId);
    const blogId = parseInt(req.params.blogId);
    const result = blogController.deleteBlog(userId, blogId);
    if (result.success) {
        res.json({ message: result.message });
    } else {
        res.status(400).json({ message: result.message });
    }
});

app.put('/api/blogs/:userId/:blogId', (req, res) => {
    const userId = parseInt(req.params.userId);
    const blogId = parseInt(req.params.blogId);
    const { title, content } = req.body;

    const user = userController.app.getUserById(userId);
    if (!user) {
        return res.status(404).json({ message: "User not found." });
    }

    const blog = user.getBlogById(blogId);
    if (!blog) {
        return res.status(404).json({ message: "Blog not found." });
    }

    let updated = false;
    if (title !== undefined && title !== null) {
        updated = blog.updateTitle(title) || updated;
    }
    if (content !== undefined && content !== null) { 
        updated = blog.updateContent(content) || updated;
    }

    if (updated) {
        res.json({ message: "Blog updated successfully", blog: blog.toJSON() });
    } else {
        res.status(400).json({ message: "No valid data provided for update or update failed." });
    }
});

app.listen(PORT, () => {
    console.log(`Backend server running at http://localhost:${PORT}`);
});
