// Import 'express' module
const express = require('express');

// Import 'cookieParser' and 'express-session' modules
const cookieParser = require('cookie-parser');
const session = require('express-session');

// Import 'path' module
const path = require('path');

// Import 'database.js' file
const database = require(__dirname +  '/public/routes/common/javascript/database.js');

// Import 'textFormatting.js' file for text formatting utilities
const { hT, hF } = require(__dirname + '/public/routes/common/javascript/textFormatting.js');

/*
 * Import the route modules
 * 'homeRoutes.js'
 * 'aboutRoutes.js'
 * 'accountRoutes.js'
 * 'chatRoutes.js'
 */
const homeRoutes = require('./public/routes/home/javascript/homeRoutes');
const aboutRoutes = require('./public/routes/about/javascript/aboutRoutes');
const accountRoutes = require('./public/routes/account/javascript/accountRoutes');
const chatRoutes = require('./public/routes/chat/javascript/chatRoutes');

// Connect to database
database.connect();

// Retrieve users data from database
database.retrieveUsersTableData()
    .then(() => {
        console.log(`${hF(filename)} Users table data retrieved successfully.`);
    })
    .catch((error) => {
        console.error(`${hF(filename)} Error retrieving users table data:`, error);
    });

// Retrieve notes data from database
database.retrieveNotesTableData()
    .then(() => {
        console.log(`${hF(filename)} Notes table data retrieved successfully.`);
    })
    .catch((error) => {
        console.error(`${hF(filename)} Error retrieving notes table data:`, error);
    });

// Create new instance of Express app
const app = express();

// Create constant port
const port = 8080;

// Set filename
const filename = 'server.js';

// Configure middleware for parsing incoming requests
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Parse cookies
app.use(cookieParser());

// Configure session
app.use(session({
    secret: 'my_secret_key_lmao', // My secret key
    resave: false,
    saveUninitialized: false,
}));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Use the route modules to define the routes
app.use('/', homeRoutes);
app.use('/about', aboutRoutes);
app.use('/account', accountRoutes);
app.use('/chat', chatRoutes);

/*
 * API endpoint to retrieve session data
 * Returns the email stored in the session
 */
app.get('/api/session', (req, res) => {
    const sessionData = {
        email: req.session.email
    };
    console.log(`${hF(filename)} Session email retrieved ${hT(req.session.email)}` );
    res.json(sessionData);
});

/*
 * Start server and listen on specified port
 */
app.listen(port, () => {
    console.log(`${hF(filename)} Server listening on port ${hT(port)}`);
});