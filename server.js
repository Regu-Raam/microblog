// server.js
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// In-memory storage
let posts = [];

app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from the "public" directory

// Endpoint to get all posts
app.get('/posts', (req, res) => {
    res.json(posts);
});

// Endpoint to create a new post
app.post('/posts', (req, res) => {
    const { content } = req.body;
    if (content) {
        const newPost = { id: posts.length + 1, content };
        posts.push(newPost);
        res.status(201).json(newPost);
    } else {
        res.status(400).send('Content is required');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
