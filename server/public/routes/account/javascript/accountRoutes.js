// Import "express" module
const express = require('express');
// Import createHash function from "crypto" module
const { createHash } = require('crypto');

// Import database.js file
const database = require(__dirname + '/../../common/javascript/database.js');

// Import text formatting utilities
const {hF, hT, hP} = require("../../common/javascript/textFormatting");

// Import "path" module
const path = require("path");

// Set filename
const filename = 'accountRoutes.js';

// Create a router instance
const router = express.Router();

/*
 * Function to convert password to its hash value
 * Returns promise that resolves to hashed password
 */
function convertToHash(password) {
    return new Promise((resolve) => {
        const hash = createHash('sha256');
        hash.update(password);
        const hashedPassword = hash.digest('hex');
        resolve(hashedPassword);
    });
}

/*
 * Route for accessing account page
 */
router.get('/', function(req, res) {
    let indexPath = path.join(__dirname + '/../html/account.html');
    res.sendFile(indexPath);
});

/*
 * Endpoint for user signin
 * Authenticates user by checking provided email and password against database
 * Stores user's email in session and sets cookie to remember user's login status
 */
router.post('/signin', (req, res) => {

    const { email, password } = req.body;
    console.log(`${hF(filename)} Trying to signin user with email: ${hT(email)}, password: ${hP(password)}`);

    convertToHash(password)
        .then((hashedPassword) => {
            console.log(`${hF(filename)} Converted password: ${hP(password)} to hashed password: ${hP(hashedPassword)}`);

            // Use appropriate function from your database file to check if data exists
            database.userExists(email, hashedPassword)
                .then((success) => {
                    if (success) {
                        // Store user's email in session
                        req.session.email = email;
                        console.log(`${hF(filename)} Storing email: ${hT(email)} in session`);

                        // Set cookie to remember user's login status
                        res.cookie('loggedIn', true);

                        console.log(`${hF(filename)} User with email: ${hT(email)} logged in successfully because user with this email exists`);
                        res.json({ success: true });
                    } else {
                        console.log(`${hF(filename)} User with email: ${hT(email)} NOT logged in successfully because user with this email does not exist`);
                        res.json({ success: false });
                    }
                })
                .catch((error) => {
                    console.error(`${hF(filename)} Error:`, error);
                    res.status(500).json({ success: false });
                });
        })
        .catch((error) => {
            // Handle error
            console.error(`${hF(filename)} Error:`, error);
            res.status(500).json({ success: false });
        });
});

/*
 * Endpoint for user signup
 * Creates new user account with provided email and password
 * Checks if user already exists before adding new user
 * Stores user's email in the session and sets cookie to remember user's login status
 */
router.post('/signup', (req, res) => {

    const { email, password, repeatPassword } = req.body;
    console.log(`${hF(filename)} Trying to signup user with email: ${hT(email)}, password: ${hP(password)}, repeat password: ${hP(repeatPassword)}`);

    // Convert the password to hashed password
    convertToHash(password)
        .then((hashedPassword) => {
            console.log(`${hF(filename)} Converted password: ${hP(password)} to hashed password: ${hP(hashedPassword)}`);

            // Check if user already exists in the database
            database.userExists(email, hashedPassword)
                .then((success) => {
                    if (!success) {
                        // Add new user to the database
                        database.addUser(email, hashedPassword)
                            .then(() => {
                                console.log(`${hF(filename)} User with email: ${hT(email)} added successfully`);

                                // Store user's email in session
                                req.session.email = email;
                                console.log(`${hF(filename)} Storing email: ${hT(email)} in session`);

                                // Set cookie to remember user's login status
                                res.cookie(`loggedIn`, true);

                                res.json({ success: true });
                            })
                            .catch((error) => {
                                console.error(`${hF(filename)} Error adding user with email: ${hT(email)}:`, error);
                                res.status(500).json({ success: false });
                            });
                    } else {
                        console.log(`${hF(filename)} User with email: ${hT(email)} NOT added successfully because user with this email already exists`);
                        res.json({ success: false });
                    }
                })
                .catch((error) => {
                    console.error(`${hF(filename)} Error:`, error);
                    res.status(500).json({ success: false });
                });
        })
        .catch((error) => {
            console.error(`${hF(filename)} Error:`, error);
            res.status(500).json({ success: false });
        });
});

// Export router as a module
module.exports = router;
