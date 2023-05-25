const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Fri3nd1998!Fri3nd1998!',
    database: 'users',
});

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Fri3nd1998!Fri3nd1998!',
    database: 'users',
    connectionLimit: 10,
});

function connect() {
    connection.connect((error) => {
        if (error) {
            console.error('Error connecting to the database:', error);
        } else {
            console.log('Connected to the database.');
        }
    });
}

function retrieveUsersTableData() {
    connection.query('SELECT * FROM users', (error, results) => {
        if (error) {
            console.error('Error retrieving data from users table:', error);
        } else {
            console.log('Users table data retrieved successfully:');
            console.table(results);
        }
    });
}

/*
function addRandomUser() {
    connection.query('INSERT INTO users (email, password) VALUES (\'johndoe@example.com\', \'niggersInPalace\');', (error, results) => {
        if (error) {
            console.error('Error adding user:', error);
        } else {
            console.log('User added successfully:');
            console.table(results);
        }
    });
}
 */

function addUser(email, password) {
    return new Promise((resolve, reject) => {
        connection.query(
            'INSERT INTO users (email, password) VALUES (?, ?);',
            [email, password],
            (error, results) => {
                if (error) {
                    console.error('Error adding user:', error);
                    reject(error);
                } else {
                    console.log('User added successfully:');
                    console.table(results);
                    resolve(results);
                }
            }
        );
    });
}

/*
function addUser(email, password) {
    connection.query('INSERT INTO users (email, password) VALUES (email, password);', (error, results) => {
        if (error) {
            console.error('Error adding user:', error);
        } else {
            console.log('User added successfully:');
            console.table(results);
        }
    });
}
 */

function userExists(email, password) {
    return new Promise((resolve, reject) => {
        // Perform the database query to check if the data exists
        const query = 'SELECT * FROM users WHERE email = ? AND password = ?;';
        connection.query(query, [email, password], (error, results) => {
            if (error) {
                reject(error);
                return;
            }

            if (results.length > 0) {
                // Data exists in the database
                resolve(true);
            } else {
                // Data does not exist in the database
                resolve(false);
            }
        });
    });
}

module.exports = {
    connect,
    retrieveUsersTableData,
    // addRandomUser,
    addUser,
    userExists
};
