// Import "express" module
const express = require('express');

// Import database.js file
const database = require(__dirname + '/../../common/javascript/database.js');

// Import text formatting utilities
const {hF, hT, hID} = require("../../common/javascript/textFormatting");

// Import "openai" module
const { Configuration, OpenAIApi } = require("openai");

// Import "path" module
const path = require("path");

// Set OpenAI API key
const apiKey = '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';

// Create new instance of OpenAI API
const configuration = new Configuration({
    apiKey: apiKey,
});
const openai = new OpenAIApi(configuration);

// Set filename
const filename = 'chatRoutes.js';

// Create router instance
const router = express.Router();

/*
 * Middleware to check if user is authenticated
 * Redirects user to login page if not authenticated
 */
const isAuthenticated = (req, res, next) => {
    if (req.session.email && req.cookies.loggedIn && req.cookies.loggedIn === 'true') {
        // User is authenticated, proceed to next middleware or route handler
        next();
    } else {
        // User is not authenticated, redirect to login page or handle as needed
        res.redirect('/account'); // Replace with your login route
    }
};

/*
 * Route for accessing chat page
 * Requires authentication using 'isAuthenticated' middleware
 */
router.get('/', isAuthenticated, (req, res) => {
    let indexPath = path.join(__dirname + '/../html/chat.html');
    res.sendFile(indexPath);
});

/*
 * Endpoint to retrieve notes for specific user in chat
 * Requires email in request body
 */
router.post('/notes/getNotes', async (req, res) => {

    const { email } = req.body;
    console.log(`${hF(filename)} Trying to retrieve note that matches email ${hT(email)}`);

    try {
        // Retrieve user_id based on provided email
        const user_id = await database.getId(email);
        console.log(`${hF(filename)} Retrieved user_id ${hID(user_id)}`);

        // Retrieve notes belonging to user with retrieved user_id
        const notes = await database.getNotesOfSpecificUser(user_id);

        if (notes) {
            console.log(`${hF(filename)} Notes that belong to user with user_id ${hID(user_id)} retrieved successfully`);
            res.json({ success: true, notes});
        } else {
            console.log(`${hF(filename)} Notes that belong to user with user_id ${hID(user_id)} NOT retrieved successfully`);
            res.json({ success: false, notes });
        }
    } catch (error) {
        console.error(`${hF(filename)} Error retrieving notes:`, error);
        res.status(500).json({ success: false });
    }
});

/*
 * Endpoint to add note to chat
 * Requires email and note_content in request body
 */
router.post('/notes/addNote', async (req, res) => {

    const { email, note_content } = req.body;
    console.log(`${hF(filename)} Trying to add note that matches email ${hT(email)} and content ${hT(note_content)}`);

    try {
        // Retrieve user_id based on provided email
        const user_id = await database.getId(email);
        console.log(`${hF(filename)} Retrieved user_id ${hID(user_id)}`);

        // Add note using retrieved user_id and note_content
        const noteAdded = await database.addNote(user_id, note_content);

        if (noteAdded) {
            console.log(`${hF(filename)} Note with user_id ${hID(user_id)} added successfully`);
            res.json({ success: true });
        } else {
            console.log(`${hF(filename)} Note with user_id ${hID(user_id)} NOT added successfully`);
            res.json({ success: false });
        }
    } catch (error) {
        console.error(`${hF(filename)} Error adding note:`, error);
        res.status(500).json({ success: false });
    }
});

/*
 * Endpoint to delete note from chat
 * Requires email and note_content in request body
 */
router.post('/notes/deleteNote', async (req, res) => {

    const { email, note_content } = req.body;
    console.log(`${hF(filename)} Trying to delete note that matches email ${hT(email)} and content ${hT(note_content)}`);

    try {
        // Retrieve note_id based on provided email and note_content
        const note_id = await database.getNoteId(email, note_content);
        console.log(`${hF(filename)} Retrieved the note_id ${hID(note_id)}`);

        // Delete note using retrieved note_id
        const noteDeleted = await database.deleteNote(note_id);

        if (noteDeleted) {
            console.log(`${hF(filename)} Note with note_id ${hID(note_id)} deleted successfully`);
            res.json({ success: true });
        } else {
            console.log(`${hF(filename)} Note with note_id ${hID(note_id)} NOT deleted successfully`);
            res.json({ success: false });
        }
    } catch (error) {
        console.error(`${hF(filename)} Error deleting note:`, error);
        res.status(500).json({ success: false });
    }
});

/*
 * Endpoint to process user messages with ChatGPT
 * Handles received userMessage and conversation to generate a response using ChatGPT model
 */
router.post('/messages/chatgpt', async (req, res) => {
    try {
        const { userMessage, conversation } = req.body;

        console.log(`${hF(filename)} Received user message: ${hT(userMessage)}`);

        const editedUserMessage = userMessage + ' Please give a very short answer. Also your response has to be related to the theme of food';

        // Add user's message to conversation
        conversation.push({ role: "user", content: editedUserMessage });

        try {
            // Use ChatGPT model to generate a response
            const completion = await openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: conversation,
            });

            // Extract generated completion text from response
            const completion_text = completion.data.choices[0].message.content;
            console.log(`${hF(filename)} Extracted generated completion text from response ${hT(completion_text)}`);

            // Send generated completion text as response
            res.json({ success: true, completion_text: completion_text });
        } catch (error) {
            if (error.response) {
                console.log(`${hF(filename)} ${error.response.status}`);
                console.log(`${hF(filename)} ${error.response.data}`);
            } else {
                console.log(`${hF(filename)} ${error.message}`);
            }
        }
    } catch (error) {
        console.error(`${hF(filename)} Error getting response from ChatGPT:`, error);
        res.status(500).json({ error: `${hF(filename)} Something went wrong` });
    }
});

/*
 * Endpoint to process user messages with DeliChat
 * Handles received userMessage and conversation to generate response using DeliChat model
 */
router.post('/messages/delichat', async (req, res) => {
    try {
        // Process received userMessage and conversation
        const { userMessage } = req.body;

        console.log(`${hF(filename)} Received user message: ${hT(userMessage)}`);
        // Perform further processing or actions based on user message

        res.json({ success: true, message: userMessage });
    } catch (error) {
        console.error(`${hF(filename)} Error getting response from DeliChat:`, error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

// Export router as a module
module.exports = router;