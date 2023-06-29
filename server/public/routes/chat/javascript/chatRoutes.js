// Import "express" module
const express = require('express');

// Import "jsonfile" module
const jsonfile = require('jsonfile');

// Import "path" module
const path = require("path");

// Import bot.json file
const response_data = jsonfile.readFileSync(path.join(__dirname, './bot.json'));

// Import recipes_formatted.json file
const recipes = jsonfile.readFileSync(path.join(__dirname, './recipes_formatted.json'));

// Import user_behaviour.json file
const userBehaviour = jsonfile.readFileSync(path.join(__dirname, './User_behaviour.json'));

// Import database.js file
const database = require(__dirname + '/../../common/javascript/database.js');

// Import text formatting utilities
const {hF, hT, hID} = require("../../common/javascript/textFormatting");

// Import "openai" module
const { Configuration, OpenAIApi } = require("openai");

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

// Setup delichat bot variables
let user_answers = {}
let currentState = 'start';
let foodArray;
const DEBUG = false;

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
        //const { userMessage } = req.body;

        //console.log(`${hF(filename)} Received user message: ${hT(userMessage)}`);
        // Perform further processing or actions based on user message

        //res.json({ success: true, message: userMessage });

        const completion_text = await handleDelichatRequest(req, res);
        res.json({ success: true, completion_text });
    } catch (error) {
        console.error(`${hF(filename)} Error getting response from DeliChat:`, error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});


const handleDelichatRequest = (req, res) => {
    return new Promise((resolve, reject) => {
        try {
            // Process received userMessage and conversation
            const { userMessage } = req.body;

            console.log(`${hF(filename)} Received user message: ${hT(userMessage)}`);
            let completion_text = '';

            if(userMessage === 'quit'){
                completion_text = "Hello my friend! I am DeliChat bot and I am here to help you to find perfect recipe! (To start dialog print [hi] or any variation of greeting)\nTo get acquainted with all the possible commands in our chatbot, write [help]\nIn order to exit the dialogue at any stage and start a new chat with the bot, write [quit]"
                currentState = 'start'
            }
            else{
                if (currentState === 'start') {
                    completion_text = startConversation(userMessage);
                } else if(currentState === 'description'){
                    foodArray = searchUserBehaviour(userMessage);
                    completion_text = 'Now we are ready to give you final recipes according to your preferences. Just print [ready]'
                    console.log(foodArray)
                    currentState = 'final'
                }
                else if (currentState === 'type') {
                    foodArray = chooseTypeOfDish(userMessage);
                    console.log(foodArray)
                    completion_text = 'Select difficulty of dish:\n"Difficult [1]",\n"Average[2]",\n"Simple[3]",\n"Any[4]"';
                    currentState = 'hardness';
                } else if(currentState === 'specific'){
                    foodArray =  searchTitle(recipes, userMessage, false, "Title", true);
                    completion_text = 'Now we are ready to give you final recipes according to your preferences. Just print [ready]'
                    console.log(foodArray)
                    currentState = 'final'
                }
                else if (currentState === 'hardness') {
                    foodArray = chooseHardness(foodArray, userMessage);
                    console.log(foodArray)
                    completion_text = 'Are you vegan? [yes/no]';
                    currentState = 'vegan';
                } else if (currentState === 'vegan') {
                    if(userMessage === 'yes'){
                        currentState = 'with ingredients'
                        foodArray = searchTitle(filterById(foodArray, recipes), "true", false, "Vegan");
                        user_answers["isVegan"] = true;
                        completion_text = 'Write list of products separated by commas, which you want to be in your dish ' +
                            '\n if there are no such products, write [0].';
                        console.log(foodArray)
                    }
                    else if(userMessage === 'no'){
                        if (!(user_answers["dishType"] === "drink" || user_answers["dishType"] === "dessert")) {
                            completion_text =  'Do you have any meat preferences? Write a comma-separated list ' +
                                '\n if there are no specific preferences, write [0].';
                            currentState = 'writeMeat'
                            user_answers["isVegan"] = false;
                        }
                        else{
                            completion_text = 'Write list of products separated by commas, which you want to be in your dish ' +
                                '\n if there are no such products, write [0].';
                            currentState = 'with ingredients';
                        }
                        console.log(foodArray)
                    }
                    else{
                        currentState = 'vegan'
                        completion_text = 'Something goes wrong. Try one more time!'
                    }
                }

                else if( currentState === 'writeMeat'){
                    let meat_types = userBehaviour[9]["Keywords"].map((element) => element.toLowerCase());
                    let userInputArray = stringToArray(userMessage)
                    let notIncludeFlag = false;
                    let falseMeat = ""
                    if(userMessage === "0"){
                        currentState = 'with ingredients'
                        completion_text = 'Write list of products separated by commas, which you want to be in your dish ' +
                            '\n if there are no such products, write [0].';
                    }
                    else{
                        for (let i = 0; i < userInputArray.length; i++) {
                            if (!meat_types.includes(userInputArray[i])) {
                                notIncludeFlag = true
                                falseMeat += userInputArray[i] + " "
                                falseMeat = falseMeat.trim()
                                completion_text = 'You have entered incorrect meat name: '+ '\''+ falseMeat + '\'' + '!\nTry again please!'
                                currentState = 'writeMeat'
                            } else if(foodArray.length === 0){
                                completion_text = 'Something goes wrong, so rewrite it from the very beginning!'
                                currentState = 'start';
                            }
                            else {
                                user_answers["meatPreference"] = true;
                                foodArray = searchIngredients(filterById(foodArray, recipes), stringToArray(userMessage), true);
                                console.log(foodArray)
                                completion_text = 'Write list of products separated by commas, which you want to be in your dish.' +
                                    '\nIf there are no such products, write [0].';
                                currentState = 'with ingredients'
                            }
                        }
                    }
                }
                else if (currentState === 'with ingredients') {
                    if(userMessage === "0"){
                        user_answers["wantedProducts"] = false;
                        currentState = 'no ingredients'
                        completion_text = 'Write list of products separated by commas, which you do not want to be in your dish ' +
                            '\n if there are no such products, write [0] (besides lactose).'
                    }
                    else {
                        user_answers["wantedProducts"] = true;
                        foodArray = searchIngredients(filterById(foodArray, recipes), stringToArray(userMessage), true)
                        console.log(foodArray)
                        if(foodArray.length === 0){
                            completion_text = 'Something goes wrong, so rewrite it from the very beginning!'
                            currentState = 'start';
                        }
                        currentState = 'no ingredients'
                        completion_text = 'Write list of products separated by commas, which you do not want to be in your dish ' +
                            '\n if there are no such products write [0] (besides lactose).'
                    }
                }
                else if(currentState === 'no ingredients'){
                    if(userMessage === "0"){
                        user_answers["unWantedProducts"] = false;
                        if (!(user_answers["dishType"] === "drink" || user_answers["dishType"] === "dessert")) {
                            currentState = 'spicy'
                            completion_text = 'Do you want food to be spicy? [yes/no/any]'
                        }
                        else{
                            currentState = 'lactose'
                            completion_text = 'Are you lactose intolerant? [yes/no]'
                        }
                    }
                    else{
                        user_answers["unWantedProducts"] = true;
                        foodArray =  filterArray(foodArray, searchIngredients(filterById(foodArray, recipes),stringToArray(userMessage), true))
                        console.log(foodArray)
                        if(foodArray.length === 0){
                            completion_text = 'Something goes wrong, so rewrite it from the very beginning!'
                            currentState = 'start';
                        }
                        else if (!(user_answers["dishType"] === "drink" || user_answers["dishType"] === "dessert")) {
                            currentState = 'spicy'
                            completion_text = 'Do you want food to be spicy? [yes/no/any]'
                        }
                        else{
                            currentState = 'lactose'
                            completion_text = 'Are you lactose intolerant? [yes/no]'
                        }
                    }
                }
                else if(currentState === 'spicy'){
                    let spicyIngredients = searchIngredients(filterById(foodArray, recipes), userBehaviour[5]["Keywords"], true)
                    let spicyTitles = searchTitle(filterById(foodArray, recipes), userBehaviour[6]["Keywords"], true)
                    let spicyFood = combineAndRemoveDuplicates(spicyIngredients, spicyTitles)
                    let notSpicyFood = filterArray(foodArray, spicyFood)
                    if (userMessage.toLowerCase() === 'yes') {
                        user_answers["isSpicy"] = true;
                        completion_text = 'Do you want vegetables to be in? [yes/no/any]'
                        foodArray = spicyFood;
                        console.log(foodArray)
                        currentState = 'vegetables'
                    } else if (userMessage.toLowerCase() === 'no') {
                        user_answers["isSpicy"] = false;
                        completion_text = 'Do you want vegetables to be in? [yes/no/any]'
                        foodArray = notSpicyFood;
                        console.log(foodArray)
                        currentState = 'vegetables'
                    } else if (userMessage.toLowerCase() === 'any') {
                        console.log(foodArray)
                        completion_text = 'Do you want vegetables to be in? [yes/no/any]'
                        currentState = 'vegetables'
                    } else if(foodArray.length === 0){
                        completion_text = 'Something goes wrong, so rewrite it from the very beginning!'
                        currentState = 'start';
                    }
                    else {
                        completion_text ='Invalid request. Please try again.'
                        currentState = 'spicy'
                    }
                }
                else if (currentState === 'vegetables'){
                    if (userMessage.toLowerCase() === 'yes'){
                        user_answers["vegetablesIn"] = true;
                        currentState = 'lactose'
                        completion_text = 'Are you lactose intolerant? [yes/no]'
                    }
                    else if (userMessage.toLowerCase() === 'no'){
                        let foodWithVegetable = searchIngredients(filterById(foodArray, recipes), userBehaviour[10]["Keywords"], true);
                        let foodWithoutVegetable = filterArray(foodArray, foodWithVegetable)
                        user_answers["vegetablesIn"] = false;
                        foodArray = foodWithoutVegetable;
                        console.log(foodArray);
                        currentState = 'lactose'
                        completion_text = 'Are you lactose intolerant? [yes/no]'
                    }
                    else if (userMessage.toLowerCase() === 'any'){
                        user_answers["vegetablesIn"] = "any";
                        currentState = 'lactose'
                        completion_text = 'Are you lactose intolerant? [yes/no]'
                    }else if(foodArray.length === 0){
                        completion_text = 'Something goes wrong, so rewrite it from the very beginning!'
                        currentState = 'start';
                    }
                    else{
                        completion_text = 'Something goes wrong, try one more time. Do you want vegetables to be in? [yes/no/any]'
                        currentState = 'vegetables'
                    }
                }
                else if (currentState === 'lactose'){
                    let lactoseIntolerantIngredients = searchIngredients(filterById(foodArray,recipes), userBehaviour[7]["Keywords"], true)
                    let lactoseIntolerantTitles = searchTitle(filterById(foodArray, recipes), userBehaviour[7]["Keywords"], true)
                    let lactoseIntolerantFood = combineAndRemoveDuplicates(lactoseIntolerantIngredients, lactoseIntolerantTitles)
                    let lactoseTolerantFood = filterArray(foodArray, lactoseIntolerantFood)
                    if (userMessage.toLowerCase() === 'yes'){
                        foodArray = lactoseTolerantFood
                        console.log(foodArray);
                        currentState = 'gluten'
                        completion_text = 'Are you gluten intolerant? [yes/no]'
                    }
                    else if (userMessage.toLowerCase() === 'no'){
                        currentState = 'gluten'
                        console.log(foodArray);
                        completion_text = 'Are you gluten intolerant? [yes/no]'
                    }
                    else if(foodArray.length === 0){
                        completion_text = 'Something goes wrong, so rewrite it from the very beginning!'
                        currentState = 'start';
                    }
                    else{
                        completion_text = 'Something goes wrong, try one more time. Are you lactose intolerant? [yes/no]'
                        currentState = 'lactose'
                    }
                }
                else if (currentState === 'gluten'){
                    let glutenIntolerantIngredients = searchIngredients(filterById(foodArray,recipes), userBehaviour[8]["Keywords"], true)
                    let glutenIntolerantTitles = searchTitle(filterById(foodArray, recipes), userBehaviour[8]["Keywords"], true)
                    let glutenIntolerantFood = combineAndRemoveDuplicates(glutenIntolerantIngredients, glutenIntolerantTitles)
                    let glutenTolerantFood = filterArray(foodArray, glutenIntolerantFood)
                    if (userMessage.toLowerCase() === 'yes'){
                        foodArray = glutenTolerantFood
                        console.log(foodArray);
                        currentState = 'sugar'
                        completion_text = 'Do you want recipe to be sweet (with sugar)?[yes/no/any]'
                    }
                    else if (userMessage.toLowerCase() === 'no'){
                        currentState = 'sugar'
                        completion_text = 'Do you want recipe to be sweet (with sugar)?[yes/no/any]'
                    }
                    else if(foodArray.length === 0){
                        completion_text = 'Something goes wrong, so rewrite it from the very beginning!'
                        currentState = 'start';
                    }
                    else{
                        completion_text = 'Something goes wrong, try one more time. Are you gluten intolerant? [yes/no]'
                        currentState = 'gluten'
                    }
                }
                else if (currentState === 'sugar'){
                    let sweetRecipes = [];
                    let notSweetRecipes = [];
                    let foodArray2 = filterById(foodArray, recipes)

                    for(let i = 0; i < foodArray2.length; i++){
                        if (foodArray2[i]["Sugar_amount"] >= 4.2){
                            sweetRecipes.push(foodArray2[i]["Id"]);
                        }
                        else{
                            notSweetRecipes.push(foodArray2[i]["Id"])
                        }
                    }
                    if(userMessage.toLowerCase() === 'yes'){
                        foodArray = sweetRecipes;
                        console.log(foodArray);
                        completion_text = 'Now we are ready to give you final recipes according to your preferences. Just print [ready]'
                        currentState = 'final'
                    }
                    else if(userMessage.toLowerCase() === 'no'){
                        foodArray = notSweetRecipes;
                        console.log(foodArray);
                        completion_text = 'Now we are ready to give you final recipes according to your preferences. Just print [ready]'
                        currentState = 'final'
                    }
                    else if(userMessage.toLowerCase() === 'any'){
                        console.log(foodArray);
                        completion_text = 'Now we are ready to give you final recipes according to your preferences. Just print [ready]'
                        currentState = 'final'
                    }
                    else if(foodArray.length === 0){
                        completion_text = 'Something goes wrong, so rewrite it from the very beginning!'
                        currentState = 'start';
                    }
                    else{
                        completion_text = 'Something goes wrong, try one more time. Do you want recipe to be sweet (with sugar)?[yes/no/any]'
                        currentState = 'sugar'
                    }
                }
                else if(currentState === 'final'){
                    if(!(foodArray.length === 0)){
                        if(userMessage === "ready"){
                            const randomIndex = Math.floor(Math.random() * foodArray.length);
                            const randomElement = foodArray[randomIndex];
                            let randomArray = []
                            randomArray.push(randomElement);
                            let final_recipe = filterById(randomArray, filterById(foodArray, recipes))
                            let ingredients = '';

                            for (let i = 0; i < final_recipe[0]['Ingredients'].length; i++) {
                                final_recipe[0]['Ingredients'][i] += '\n';
                                ingredients += (final_recipe[0]['Ingredients'][i]);
                                console.log(ingredients);
                            }

                            completion_text = ">>>Title: "+final_recipe[0]['Title'] + "\n>>> Ingredients: "+ "\n" +ingredients + ">>> Instruction: "+final_recipe[0]['Instructions'] + "\n>>> "+ 'Are you satisfied with given recipe? [yes/no]'
                            console.log(completion_text)
                            foodArray = filterArray(foodArray, randomArray);
                            console.log(foodArray);
                            currentState = 'final question'
                        }
                        else{
                            completion_text = 'Something goes wrong, just print [ready]'
                            currentState = 'final'
                        }
                    }
                    else{
                        completion_text = "You were not able to choose any of recipes! Try one more time!\nNow you will be redirected to the start of conversation!\nPrint [help] or [quit] to refresh possibilities of bot!"
                        currentState = 'start'
                    }
                }
                else if (currentState === 'final question'){
                    if (userMessage.toLowerCase() === 'yes'){
                        currentState = 'start'
                        completion_text = 'We are very happy that you could choose one of the recipes! Now you will be redirected to the start of conversation!'
                    }
                    else if (userMessage.toLowerCase() === 'no'){
                        completion_text = 'Print [ready] to see another recipe'
                        currentState = 'final'
                    }
                    else{
                        completion_text = 'Invalid command. Please try again.';
                        currentState = 'final'
                    }
                }
            }

            resolve(completion_text);
        } catch (error) {
            console.error(`${hF(filename)} Error getting response from DeliChat:`, error);
            reject(error);
        }
    });
};

function get_response(input_string){
    const split_message = input_string.toLowerCase().split(/\s+|[,;?!.-]\s*/);
    const score_list = []

    for(let i = 0; i < response_data.length; i++){
        let response_score = 0;
        let required_score = 0;
        let required_words = response_data[i]["required_words"];

        if(required_words){
            for(let j = 0; j < split_message.length; j++){
                if(required_words.includes(split_message[j])){
                    required_score += 1;
                }
            }
        }
        if(required_score === required_words.length){
            for(let k = 0; k < split_message.length; k++){
                if(response_data[i]["user_input"].includes(split_message[k])){
                    response_score += 1;
                }
            }
        }
        score_list.push(response_score);
    }

    let best_response = Math.max(...score_list);
    let response_index = score_list.indexOf(best_response)


    if(input_string === ""){
        return "Please type something so we can chat :("
    }
    if(best_response !== 0){
        return response_data[response_index]["bot_response"]
    }

    return random_string()
}

function random_string() {
    const random_list = [
        "Please try writing something more descriptive.",
        "Oh! It appears you wrote something I don't understand yet",
        "Do you mind trying to rephrase that?",
        "I'm terribly sorry, I didn't quite catch that.",
        "I can't answer that yet, please try asking something else."
    ];

    let list_count = random_list.length;
    let random_item = Math.floor(Math.random() * list_count);

    return random_list[random_item]
}

function searchTitle(jsonData, searchPattern, isArray = false, field = "Title", checkAllElements = false) {
    let searchWords;
    let wordIsFound = false;
    if (isArray === false) {
        searchWords = searchPattern.toLowerCase().split(' ');
    } else {
        searchWords = searchPattern;
    }
    const matchedIds = [];
    for (let i = 0; i < jsonData.length; i++) { // split json
        const title = jsonData[i][field].toLowerCase();
        let titleWords = title.replace(/[^\w\s]|_/g, " ").split(' '); // title words => array
        titleWords = [...new Set(titleWords)];
        titleWords = titleWords.map(element => element.toLowerCase());
        let matchCount = 0; // Count of matched search words in the title
        for (let j = 0; j < searchWords.length; j++) { // split search words
            let searchWord = searchWords[j].replace(/[^\w\s]|_/g, " ").split(' ');
            searchWord = searchWord.map(element => element.toLowerCase());
            wordIsFound = checkElements(searchWord, titleWords, checkAllElements);

            if (wordIsFound) {
                matchCount++;
                if (checkAllElements === false && !matchedIds.includes(jsonData[i]["Id"])){
                    matchedIds.push(jsonData[i]["Id"]);
                }
            }
            if (matchCount === searchWords.length && checkAllElements === true && !matchedIds.includes(jsonData[i]["Id"])){
                matchedIds.push(jsonData[i]["Id"]);
            }
        }
    }

    return matchedIds;
}

function searchIngredients(jsonData, searchPattern, isArray = false, checkAllElements = false) {
    let searchWords;
    let wordIsFound = false;
    if (isArray === false) {
        searchWords = searchPattern.toLowerCase().split(' ');
    } else {
        searchWords = searchPattern;
    }
    const matchedIds = [];
    for (let i = 0; i < jsonData.length; i++) {
        let newSearchWords = searchWords.slice();
        let matchCount = 0;
        const ingredients = jsonData[i]["Ingredients"];
        for (let k = 0; k < ingredients.length; k++) {
            const ingredientWord = ingredients[k].toLowerCase();
            for(let j = 0; j < newSearchWords.length; j++){
                let newSearchWord = newSearchWords[j].replace(/[^\w\s]|_/g, " ").split(' ');
                newSearchWord = newSearchWord.map(element => element.toLowerCase());
                wordIsFound = checkElements(removePattern(newSearchWord), removePattern(ingredientWord.split(' ')), checkAllElements);
                if (wordIsFound === true) {
                    matchCount++;
                    newSearchWords[j] = ""
                    if (checkAllElements === false && !matchedIds.includes(jsonData[i]["Id"])){
                        matchedIds.push(jsonData[i]["Id"]);
                    }
                }
                if (matchCount === searchWords.length && checkAllElements === true && !matchedIds.includes(jsonData[i]["Id"])){
                    matchedIds.push(jsonData[i]["Id"]);
                }
            }
        }
    }
    return matchedIds;
}


function searchUserBehaviour(userInput) {
    const matchedTitles = [];
    let userInputCut = userInput.toLowerCase().split(' ');
    for (let i = 0; i < userInputCut.length; i++) {
        if (userInputCut[i] === 'not' && i < userInputCut.length - 1) {
            userInputCut[i] = 'not ' + userInputCut[i+1];
            userInputCut.splice(i+1, 1);
        }
    }
    for (let i = 0; i < userBehaviour.length; i++) {
        const keywords = userBehaviour[i]["Keywords"];
        let matchCount = 0;

        for (let j = 0; j < userInputCut.length; j++) {
            const searchWord = userInputCut[j];

            for (let k = 0; k < keywords.length; k++) {
                const keyword = keywords[k];
                if (keyword.includes(searchWord) && searchWord.includes(keyword)) {
                    matchCount++;
                    if (!matchedTitles.includes(userBehaviour[i]["Title"])) {
                        matchedTitles.push(userBehaviour[i]["Title"]);
                    }
                    break;
                }
            }
        }
    }
    if (DEBUG === true) {
        console.log(matchedTitles)
    }

    let ingredientsWith = [];
    let ingredientsWithout = [];
    if(userInputCut.includes("with")){
        for(let i = userInputCut.indexOf("with") + 1; i < userInputCut.length; i++){
            ingredientsWith.push(userInputCut[i]);
        }
        if (DEBUG ===true) {
            console.log(ingredientsWith)
        }
    }
    else if (userInputCut.includes("without")){
        for(let i = userInputCut.indexOf("with") + 1; i < userInputCut.length; i++){
            ingredientsWithout.push(userInputCut[i]);
        }
        if (DEBUG === true) {
            console.log(ingredientsWithout)
        }
    }

    let foodArray = [];
    for(let k = 0; k < recipes.length; k++){
        foodArray.push(recipes[k]["Id"])
    }

    for(let i = 0; i < matchedTitles.length; i++){
        if(matchedTitles[i] === "sweet titles"){
            let sweetDishes = [];
            let foodArray2 = filterById(foodArray, recipes)
            for(let i = 0; i < foodArray2.length; i++) {
                if (foodArray2[i]["Sugar_amount"] >= 4.2) {
                    sweetDishes.push(foodArray2[i]["Id"]);
                }
            }
            foodArray = sweetDishes;
        }
        if(matchedTitles[i] === "not sweet titles"){
            let notSweetDishes = [];
            let foodArray2 = filterById(foodArray, recipes)

            for(let i = 0; i < foodArray2.length; i++) {
                if (foodArray2[i]["Sugar_amount"] <= 4.2) {
                    notSweetDishes.push(foodArray2[i]["Id"])
                }
            }
            foodArray = notSweetDishes;
        }
        if(matchedTitles[i] === "spicy titles"){
            let spicyIngredients = searchIngredients(filterById(foodArray,recipes), userBehaviour[5]["Keywords"], true);
            let spicyTitles = searchTitle(filterById(foodArray, recipes), userBehaviour[6]["Keywords"], true);
            foodArray = combineAndRemoveDuplicates(spicyIngredients, spicyTitles);
        }
        if(matchedTitles[i] === "not-spicy"){
            let spicyIngredients = searchIngredients(filterById(foodArray,recipes), userBehaviour[5]["Keywords"], true);
            let spicyTitles = searchTitle(filterById(foodArray, recipes), userBehaviour[6]["Keywords"],  true);
            let SpicyFood = combineAndRemoveDuplicates(spicyIngredients, spicyTitles);
            foodArray = filterArray(foodArray, SpicyFood);
        }
        if(matchedTitles[i] === "no-lactose"){
            let lactoseIntolerantIngredients = searchIngredients(filterById(foodArray,recipes), userBehaviour[7]["Keywords"], true);
            let lactoseIntolerantTitles = searchTitle(filterById(foodArray, recipes), userBehaviour[7]["Keywords"],  true);
            let lactoseIntolerantFood = combineAndRemoveDuplicates(lactoseIntolerantIngredients, lactoseIntolerantTitles);
            foodArray = filterArray(foodArray, lactoseIntolerantFood);
        }
        if(matchedTitles[i] === "no-gluten"){
            let glutenIntolerantIngredients = searchIngredients(filterById(foodArray,recipes), userBehaviour[8]["Keywords"], true);
            let glutenIntolerantTitles = searchTitle(filterById(foodArray, recipes), userBehaviour[8]["Keywords"], true);
            let glutenIntolerantFood = combineAndRemoveDuplicates(glutenIntolerantIngredients, glutenIntolerantTitles);
            foodArray = filterArray(foodArray, glutenIntolerantFood);
        }
        if(matchedTitles[i] === "Main Type"){
            foodArray = searchTitle(filterById(foodArray, recipes), 'main', false, "Type_dish");
        }
        if(matchedTitles[i] === "Salad Type"){
            foodArray = searchTitle(filterById(foodArray, recipes), 'salad', false, "Type_dish");
        }
        if(matchedTitles[i] === "Dessert Type"){
            foodArray = searchTitle(filterById(foodArray, recipes), 'dessert', false, "Type_dish");
        }
        if(matchedTitles[i] === "Drink Type"){
            foodArray = searchTitle(filterById(foodArray, recipes), 'drink', false, "Type_dish");
        }
        if(matchedTitles[i] === "simple"){
            foodArray = searchTitle(filterById(foodArray, recipes), 'simple', false, "Difficulty");}
        if(matchedTitles[i] === "average"){
            foodArray = searchTitle(filterById(foodArray, recipes), 'average', false, "Difficulty");
        }
        if(matchedTitles[i] === "difficult") {
            foodArray = searchTitle(filterById(foodArray, recipes), 'difficult', false, "Difficulty");
        }
        if(matchedTitles[i] === "Vegan-Title"){
            foodArray = searchTitle(filterById(foodArray, recipes), 'true', false, "Vegan");
        }
        if(matchedTitles[i] === "with ingredients") {
            if (ingredientsWith.includes("and")){
                const elementToDelete = "and";
                const indexToDelete = ingredientsWith.indexOf(elementToDelete);
                if (indexToDelete !== -1) {
                    ingredientsWith.splice(indexToDelete, 1);
                }
                foodArray = searchIngredients(filterById(foodArray, recipes), ingredientsWith, true, true)
            }
            else if (ingredientsWith.includes(",")){
                const elementToDelete = ",";
                const indexToDelete = ingredientsWith.indexOf(elementToDelete);
                if (indexToDelete !== -1) {
                    ingredientsWith.splice(indexToDelete, 1);
                }
                foodArray = searchIngredients(filterById(foodArray, recipes), ingredientsWith, true, true)
            }
            else if(ingredientsWith.includes("or")){
                const elementToDelete = "or";
                const indexToDelete = ingredientsWith.indexOf(elementToDelete);
                if (indexToDelete !== -1) {
                    ingredientsWith.splice(indexToDelete, 1);
                }
                foodArray = searchIngredients(filterById(foodArray, recipes), ingredientsWith, true, false)
            }
            foodArray = searchIngredients(filterById(foodArray, recipes), ingredientsWith, true, false)
        }
        if(matchedTitles[i] === "without ingredients"){
            let foodArray1 = [];
            if (ingredientsWithout.includes("and")){
                const elementToDelete = "and";

                const indexToDelete = ingredientsWithout.indexOf(elementToDelete);
                if (indexToDelete !== -1) {
                    ingredientsWithout.splice(indexToDelete, 1);
                }
                foodArray1 = searchIngredients(filterById(foodArray, recipes), ingredientsWithout, true, true)
                foodArray =  filterArray(foodArray, foodArray1);
            }
            else if(ingredientsWithout.includes("or")){
                const elementToDelete = "or";

                const indexToDelete = ingredientsWithout.indexOf(elementToDelete);
                if (indexToDelete !== -1) {
                    ingredientsWithout.splice(indexToDelete, 1);
                }
                foodArray1 = searchIngredients(filterById(foodArray, recipes), ingredientsWithout, true, false)
                foodArray = filterArray(foodArray, foodArray1);
            }
            foodArray1 = searchIngredients(filterById(foodArray, recipes), ingredientsWithout, true, false)
            foodArray = filterArray(foodArray, foodArray1);
        }
        if(matchedTitles[i] === "") {
            return get_response("")
        }
    }
    return foodArray;
}

function startConversation(user_input){
    if(get_response(user_input) === "Select the type of dish \n\"Main[1]\", \n\"Salad[2]\", \n\"Dessert[3]\",\n\"Drink[4]\")"){
        currentState = 'type'
        return get_response(user_input)
    }
    if(get_response(user_input) === "Print the name of the recipe:"){
        currentState = 'specific'
        return get_response(user_input);
    }
    if(get_response(user_input).includes("Write down the description of the dish you want:")){
        currentState = 'description'
        return get_response(user_input);
    }
    // if(get_response(user_input) === "not agree") {
    //     return get_response(user_input);
    // }
    currentState = 'start'
    return get_response(user_input)
}


function chooseHardness(foodArray, userInput){
    if (DEBUG === true){
        console.log(foodArray)
    }
    if (userInput === '1') {
        user_answers["hardness"] = "difficult";
        return searchTitle(filterById(foodArray, recipes), "difficult", false, "Difficulty",  false)
    } else if (userInput === '2') {
        user_answers["hardness"] = "average";
        return searchTitle(filterById(foodArray, recipes), "average", false, "Difficulty",  false)
    }
    else if (userInput === '3') {
        user_answers["hardness"] = "simple";
        return searchTitle(filterById(foodArray, recipes), "simple", false, "Difficulty", false)
    }
    else if (userInput === '4') {
        user_answers["hardness"] = "any";
        return foodArray
    }
    else if (userInput === '5') {
        currentState = 'start'
        startConversation("hi");
    }
    else {
        console.log('Invalid command. Please try again.');
        currentState = 'hardness'
        chooseHardness(foodArray, userInput)
    }
}


function chooseTypeOfDish(userInput){
    let SaladType = searchTitle(recipes, "salad", false,  "Type_dish",  true)
    let DessertType = searchTitle(recipes, "dessert", false, "Type_dish",  true)
    let DrinkType = searchTitle(recipes, "drink", false, "Type_dish",  true)
    let notDrinkArray = searchTitle(filterById(DrinkType, recipes), userBehaviour[17]["Keywords"], true,"Title" , true)
    DrinkType = filterArray(DrinkType, notDrinkArray)
    let MainType = searchTitle(recipes, "main", false, "Type_dish")
    if (userInput === '1') {
        user_answers["dishType"] = "main";
        return MainType
    } else if (userInput === '2') {
        user_answers["dishType"] = "salad";
        return SaladType
    }
    else if (userInput === '3') {
        user_answers["dishType"] = "dessert";
        return DessertType
    }
    else if (userInput === '4'){
        user_answers["dishType"] = "drink";
        return DrinkType
    }
    else if (userInput === '5'){
        currentState = 'start'
        return 'Hi User!'
    }
    else {
        chooseTypeOfDish(userInput)
        currentState = 'type'
        return "try one more time"
    }
}


function checkElements(array1, array2, allElements) {
    if (allElements) {
        for (let i = 0; i < array1.length; i++) {
            if (!array2.includes(array1[i])) {
                return false;
            }
        }
        return true;
    } else {
        for (let i = 0; i < array1.length; i++) {
            if (array2.includes(array1[i])) {
                return true;
            }
        }
        return false;
    }
}

function filterArray(array1, array2) { // 1ый массив это все, второй это часть, вовзращает 1ый в котором нет 2ого
    return array1.filter(function (element) {
        return !array2.includes(element);
    });
}

function removePattern(arr) {
    let new_arr = [];
    for(let i = 0; i < arr.length; i++){
        let length = arr[i].length;
        let lastLetter = arr[i][length - 1];
        let lastTwoLetters = arr[i].slice(length - 2);

        if (length >= 1 && lastLetter === "s" && !(lastTwoLetters === "es")) {
            new_arr.push(arr[i].slice(0, length - 1));
        } else if (length >= 2 && lastTwoLetters === "es") {
            new_arr.push(arr[i].slice(0, length - 2));
        } else if (length >= 3 && lastTwoLetters === "ves") {
            new_arr.push(arr[i].slice(0, length - 3));
        } else {
            new_arr.push(arr[i]);
        }
    }
    return new_arr;
}

function stringToArray(text) {
    let array = text.toLowerCase().split(',');

    // Remove leading and trailing whitespace from each element
    array = array.map(function(element) {
        return element.trim();
    });

    return array;
}


function combineAndRemoveDuplicates(array1, array2) {
    let combinedArray = array1.concat(array2);
    return [...new Set(combinedArray)];
}

function filterById(ids, dictionaries) {
    return dictionaries.filter(function (dict) {
        return ids.includes(dict["Id"].toString());
    });
}

// Export router as a module
module.exports = router;