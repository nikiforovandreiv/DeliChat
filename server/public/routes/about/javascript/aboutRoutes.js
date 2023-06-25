// Import "express" module
const express = require('express');

// Import "path" module
const path = require("path");

// Create a router instance
const router = express.Router();

/*
 * Route for accessing default about page
 */
router.get('/', function(req, res) {
    let indexPath = path.join(__dirname + '/../html/about.html');
    res.sendFile(indexPath);
});

// Export router as a module
module.exports = router;