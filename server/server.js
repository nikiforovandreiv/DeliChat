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

// Serve the main file as the default page
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/front/html/main.html');
});

// Serve the account file as the account page
app.get('/account', function(req, res) {
    res.sendFile(__dirname + '/public/front/html/account.html');
});

// Start the server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});