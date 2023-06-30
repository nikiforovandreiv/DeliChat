// Import "mysql2/promise" module
const mysql = require('mysql2/promise');

// Import "fs" module
const fs = require('fs');

// Import "path" module
const path = require('path');

// Import text formatting utilities
const {hF, hT, hP, hID} = require("../../common/javascript/textFormatting");

// Set filename
const filename = 'database.js';

// Read the SSL certificate file
const ssl = {
    ca: fs.readFileSync(path.join(__dirname, '../../../../../ssl_ca_file/DigiCertGlobalRootCA.crt.pem'))
};

// Create connection pool
const pool = mysql.createPool({
    host: 'delichat-database.mysql.database.azure.com',
    user: 'delichatAdmin',
    password: 'Fri3nd1998!Fri3nd1998!',
    database: 'database',
    ssl: ssl,
    connectionLimit: 100
});

// Function to establish database connection
async function connect() {
    try {
        await pool.getConnection();
        console.log(`${hF(filename)} Connected to database`);
    } catch (error) {
        console.error(`${hF(filename)} Error connecting to database:`, error);
    }
}

// Function to retrieve data from users table
async function retrieveUsersTableData() {
    try {
        const [rows] = await pool.query('SELECT * FROM users');
        console.log(`${hF(filename)} Users table data retrieved successfully:`);
        console.table(rows);
    } catch (error) {
        console.error(`${hF(filename)} Error retrieving data from users table:`, error);
    }
}

// Function to retrieve data from notes table
async function retrieveNotesTableData() {
    try {
        const [rows] = await pool.query('SELECT * FROM notes');
        console.log(`${hF(filename)} Notes table data retrieved successfully:`);
        console.table(rows);
    } catch (error) {
        console.error(`${hF(filename)} Error retrieving data from notes table:`, error);
    }
}

// Function to get notes for specific user
async function getNotesOfSpecificUser(user_id) {
    try {
        const [rows] = await pool.query('SELECT note_content FROM notes WHERE user_id = ?', [user_id]);
        console.log(`${hF(filename)} Notes that belong to user with user_id ${hID(user_id)} retrieved successfully:`);
        console.log(rows);
        return rows;
    } catch (error) {
        console.error(`${hF(filename)} Error retrieving note content from notes table that belong to user with user_id ${hID(user_id)}:`, error);
        throw error;
    }
}

// Function to get user ID based on email
async function getId(email) {
    try {
        const [rows] = await pool.query('SELECT user_id FROM users WHERE email = ?', [email]);
        console.log(`${hF(filename)} User ID with email ${hT(email)} retrieved successfully:`);
        console.log(rows);
        return rows[0] ? rows[0].user_id.toString() : null;
    } catch (error) {
        console.error(`${hF(filename)} Error retrieving user_id with email ${hT(email)}:`, error);
        throw error;
    }
}

// Function to get note ID based on email and note content
async function getNoteId(email, note_content) {
    try {
        const user_id = await getId(email);
        const [rows] = await pool.query('SELECT note_id FROM notes WHERE user_id = ? AND note_content = ?', [user_id, note_content]);
        console.log(`${hF(filename)} Note ID with email ${hT(email)} and note content ${hT(note_content)} retrieved successfully:`);
        return rows[0] ? rows[0].note_id.toString() : null;
    } catch (error) {
        console.error(`${hF(filename)} Error retrieving note_id with email ${hT(email)} and note content ${hT(note_content)}:`, error);
        throw error;
    }
}

// Function to add user to database
async function addUser(email, password) {
    try {
        const [results] = await pool.query('INSERT INTO users (email, password) VALUES (?, ?);', [email, password]);
        console.log(`${hF(filename)} User with email ${hT(email)} and password ${hP(password)} added successfully:`);
        console.table(results);
        return results;
    } catch (error) {
        console.error(`${hF(filename)} Error adding user with email ${hT(email)} and password ${hP(password)}:`, error);
        throw error;
    }
}

// Function to check if user exists in database
async function userExists(email, password) {
    try {
        const [results] = await pool.query('SELECT * FROM users WHERE email = ? AND password = ?;', [email, password]);
        if (results.length > 0) {
            console.log(`${hF(filename)} User with email ${hT(email)} and password ${hP(password)} exists in the database.`);
            return true;
        } else {
            console.log(`${hF(filename)} User with email ${hT(email)} and password ${hP(password)} does NOT exist in the database.`);
            return false;
        }
    } catch (error) {
        console.error(`${hF(filename)} Error checking user existence with email ${hT(email)} and password ${hP(password)}:`, error);
        throw error;
    }
}

// Function to add note to database
async function addNote(user_id, note_content) {
    try {
        const [results] = await pool.query('INSERT INTO notes (user_id, note_content) VALUES (?, ?);', [user_id, note_content]);
        console.log(`${hF(filename)} Note with user_id ${hID(user_id)} and note_content ${hT(note_content)} added successfully:`);
        console.table(results);
        return results;
    } catch (error) {
        console.error(`${hF(filename)} Error adding note with user_id ${hID(user_id)} and note_content ${hT(note_content)}:`, error);
        throw error;
    }
}

// Function to delete note from database
async function deleteNote(note_id) {
    try {
        const [results] = await pool.query('DELETE FROM notes WHERE note_id = ?', [note_id]);
        console.log(`${hF(filename)} Note with note_id ${hID(note_id)} deleted successfully:`);
        console.table(results);
        return results;
    } catch (error) {
        console.error(`${hF(filename)} Error deleting note with note_id ${hID(note_id)}:`, error);
        throw error;
    }
}

// Export functions as a module
module.exports = {
    connect,
    retrieveUsersTableData,
    retrieveNotesTableData,
    getNotesOfSpecificUser,
    getId,
    getNoteId,
    addUser,
    userExists,
    addNote,
    deleteNote,
};