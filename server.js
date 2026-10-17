require('dotenv').config();

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Custom middleware: log every incoming request
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
    next();
});

// Parse incoming JSON request bodies
app.use(express.json());

// GET / - Serve the static HTML page
 app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));   
});

// Serve other static files from the public folder
app.use(express.static(__dirname));
// POST /user - Create/respond to a user submission
app.post('/user', (req, res) => {
    const { name, email } = req.body || {};

    if (
        typeof name !== 'string' ||
        !name.trim() ||
        typeof email !== 'string' ||
        !email.trim()
    ) {
        return res.status(400).json({
            error: 'Name and email are required.'
        });
    }

    res.status(200).send(`Hello, ${name.trim()}!`);
});

// GET /user/:id - Return a user profile message
app.get('/user/:id', (req, res) => {
    res.send(`User ${req.params.id} profile`);
});

// Handle malformed JSON
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({
            error: 'Invalid JSON format.'
        });
    }

    next(err);
});

// General error handler
app.use((err, req, res, next) => {
    console.error(err.stack);

    res.status(500).json({
        error: 'Internal server error.'
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
