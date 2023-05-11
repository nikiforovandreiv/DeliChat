//Import the "express" module
const express = require('express');

//Create a new instance of the Express app
const app = express();

//Create a constant port
const port = 3000;

//Create a constant path
const path = require('path');

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to set the 'Content-Type' header of CSS files to 'text/css'
app.use((req, res, next) => {
    if (req.url.endsWith('.css')) {
        res.type('text/css');
    }
    next();
});

// Serve the main file as the default page
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/front/html/main.html');
});

// Start the server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});