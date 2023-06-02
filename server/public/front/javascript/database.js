const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Fri3nd1998!Fri3nd1998!',
    database: 'database',
});

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Fri3nd1998!Fri3nd1998!',
    database: 'database',
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

function getId(email) {
    return new Promise((resolve, reject) => {
        connection.query(
            'SELECT user_id FROM users WHERE email = ?',
            [email],
            (error, results) => {
                if (error) {
                    console.error('Error retrieving user_id:', error);
                    reject(error);
                } else {
                    console.log('User id retrieved successfully:');
                    console.log(results);
                    const userId = results[0].user_id.toString(); // Convert userId to text
                    resolve(userId);
                }
            }
        );
    });
}

function getNoteId(email, note_content) {
    return new Promise((resolve, reject) => {
        getId(email)
            .then((user_id) => {
                connection.query(
                    'SELECT note_id FROM notes WHERE user_id = ? AND note_content = ?',
                    [user_id, note_content],
                    (error, results) => {
                        if (error) {
                            console.error('Error retrieving note id:', error);
                            reject(error);
                        } else {
                            console.log('Note id retrieved successfully');
                            const noteId = results[0] ? results[0].note_id.toString() : null;
                            resolve(noteId);
                        }
                    }
                );
            })
            .catch((error) => {
                console.error('Error retrieving user_id:', error);
                reject(error);
            });
    });
}

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

function addNote(user_id, note_content) {
    return new Promise((resolve, reject) => {
        connection.query(
            'INSERT INTO notes (user_id, note_content) VALUES (?, ?);',
            [user_id, note_content],
            (error, results) => {
                if (error) {
                    console.error('Error adding note:', error);
                    reject(error);
                } else {
                    console.log('Note added successfully:');
                    console.table(results);
                    resolve(results);
                }
            }
        );
    });
}

function deleteNote(note_id) {
    return new Promise((resolve, reject) => {
        connection.query(
            'DELETE FROM notes WHERE note_id = ?',
            [note_id],
            (error, results) => {
                if (error) {
                    console.error('Error deleting note:', error);
                    reject(error);
                } else {
                    console.log('Note deleted successfully:');
                    console.table(results);
                    resolve(results);
                }
            }
        );
    });
}

module.exports = {
    connect,
    retrieveUsersTableData,
    getId,
    getNoteId,
    addUser,
    userExists,
    addNote,
    deleteNote
};
