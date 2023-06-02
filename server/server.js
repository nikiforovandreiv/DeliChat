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

// Convert password to hashed password
function convertToHash(password) {
    return new Promise((resolve) => {
        const hash = crypto.createHash('sha256');
        hash.update(password);
        const hashedPassword = hash.digest('hex');
        resolve(hashedPassword);
    });
}

// API endpoint to retrieve session data
app.get('/api/session', (req, res) => {
    const sessionData = {
        email: req.session.email
    };
    console.log(req.session.email);
    res.json(sessionData);
});

// API endpoint to receive user messages
app.post('/api/message', (req, res) => {
    const { message } = req.body;
    // Process the received message as needed
    console.log(`Received message: ${message}`);
    res.json({ success: true });
});

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
                        database.addUser(email, hashedPassword)
                            .then(() => {
                                console.log('User added successfully');

                                // Store the user's email in the session
                                req.session.email = email;
                                console.log(email)

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

app.post('/chat/addNote', async (req, res) => {
    const { email, note_content } = req.body;

    console.log(email);
    console.log(note_content);

    try {
        const user_id = await database.getId(email);
        console.log(user_id);

        const noteAdded = await database.addNote(user_id, note_content);

        if (noteAdded) {
            console.log('Note added successfully');
            res.json({ success: true });
        } else {
            res.json({ success: false });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false });
    }
});

app.post('/chat/deleteNote', async (req, res) => {
    const { email, note_content } = req.body;

    console.log(email);
    console.log(note_content);

    try {
        const note_id = await database.getNoteId(email, note_content);
        console.log(note_id);

        const noteDeleted = await database.deleteNote(note_id);

        if (noteDeleted) {
            console.log('Note deleted successfully');
            res.json({ success: true });
        } else {
            res.json({ success: false });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false });
    }
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