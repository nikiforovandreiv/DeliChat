// Import the "express" module
const express = require('express');

// Import the "bcrypt" module
const crypto = require('crypto');

// Import the "cookieParser" and "express-session" modules
const cookieParser = require('cookie-parser');
const session = require('express-session');

// Import the database.js file
const database = require(__dirname +  '/public/front/javascript/database.js');

// Connect to the database
database.connect();

// Retrieve data from the database
database.retrieveUsersTableData();

// Create a new instance of the Express app
const app = express();

// Create a constant port
const port = 3000;

// Create a constant path
const path = require('path');
const {addUser} = require("./public/front/javascript/database");

// Configure middleware for parsing incoming requests
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Parse cookies
app.use(cookieParser());

// Configure session
app.use(session({
    secret: 'my_secret_key_lmao', // Replace with your own secret key
    resave: false,
    saveUninitialized: false,
}));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Convert password to hashed password
function convertToHash(password) {
    return new Promise((resolve, reject) => {
        const hash = crypto.createHash('sha256');
        hash.update(password);
        const hashedPassword = hash.digest('hex');
        resolve(hashedPassword);
    });
}

// Serve the main file as the default page
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/front/html/home.html');
});

// Serve the account file as the account page
app.get('/account', function(req, res) {
    res.sendFile(__dirname + '/public/front/html/account.html');
});

app.post('/account/signin', (req, res) => {
    const { email, password } = req.body;

    console.log(email);
    console.log(password);

    convertToHash(password)
        .then((hashedPassword) => {
            console.log(hashedPassword);

            // Use the appropriate function from your database file to check if the data exists
            database.userExists(email, hashedPassword)
                .then((success) => {
                    if (success) {
                        // Store the user's email in the session
                        req.session.email = email;

                        // Set a cookie to remember the user's login status
                        res.cookie('loggedIn', true);
                    }
                    res.json({ success });
                })
                .catch((error) => {
                    console.error('Error:', error);
                    res.status(500).json({ success: false });
                });
        })
        .catch((error) => {
            // Handle error
            console.error('Error:', error);
            res.status(500).json({ success: false });
        });
});

app.post('/account/signup', (req, res) => {
    const { email, password, repeatPassword } = req.body;

    console.log(email);
    console.log(password);
    console.log(repeatPassword);

    convertToHash(password)
        .then((hashedPassword) => {
            console.log(hashedPassword);

            // Use the appropriate function from your database file to check if the data exists
            database.userExists(email, hashedPassword)
                .then((success) => {
                    if (!success) {
                        addUser(email, hashedPassword)
                            .then(() => {
                                console.log('User added successfully');

                                // Store the user's email in the session
                                req.session.email = email;

                                // Set a cookie to remember the user's login status
                                res.cookie('loggedIn', true);

                                res.json({ success: true });
                            })
                            .catch((error) => {
                                console.error('Error adding user:', error);
                                res.status(500).json({ success: false });
                            });
                    } else {
                        res.json({ success: false });
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                    res.status(500).json({ success: false });
                });
        })
        .catch((error) => {
            // Handle error
            console.error('Error:', error);
            res.status(500).json({ success: false });
        });


});

// Middleware to check if the user is authenticated
const isAuthenticated = (req, res, next) => {
    if (req.session.email && req.cookies.loggedIn && req.cookies.loggedIn === 'true') {
        // User is authenticated
        next();
    } else {
        // User is not authenticated, redirect to login page or handle as needed
        res.redirect('/account'); // Replace with your login route
    }
};

// Example route that requires authentication
app.get('/chat', isAuthenticated, (req, res) => {
    res.sendFile(__dirname + '/public/front/html/chat.html');
});

// Start the server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});