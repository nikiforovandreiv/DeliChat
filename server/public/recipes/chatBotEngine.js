const jsonfile = require('jsonfile');
const readline = require('readline-sync');

const file_with_responses = 'bot.json'

let response_data = jsonfile.readFileSync(file_with_responses)


const file = 'recipes_formatted.json'; // replace with your JSON file path
let recipes = jsonfile.readFileSync(file);


const file_user_input = 'user_behaviour.json'; // replace with your JSON file path
let userBehaviour = jsonfile.readFileSync(file_user_input);


let user_answers = {}

const DEBUG = true;

// function inputOutput(prompt){
//   const userInput = readline.question(prompt);
//   let msgID = seconds_since_epoch()
//   return userInput;
// }
//
// function outputBotResponse(response = ""){
//   let msgID = seconds_since_epoch()
//   console.log(response)
// }
// function seconds_since_epoch(){ return Math.floor( Date.now() / 1000 ) }


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
        console.log(get_response(""))
    }
  }
  finalChoice(foodArray);
}

function startConversation(){
  console.log('Hello my friend! I am DeliChat bot and I am here to help you to find perfect recipe!')
  while(true){
    let user_input = readline.question("User: ")
    console.log("Bot: ", get_response(user_input))
    if(get_response(user_input) === "Starting the poll..."){
      chooseTypeOfDish();
      break;
    }
    if(get_response(user_input) === "Print the name of the recipe:"){
      finalChoice(searchTitle(recipes, readline.question(), false, "Title", true));
      break;
    }
    if(get_response(user_input).includes("Write down the description of the dish you want:")){
      searchUserBehaviour(readline.question());
      break;
    }
    if(get_response(user_input) === "not agree"){
      get_response(user_input);
      break;
    }
  }
}

startConversation()

function finalChoice(foodArray){
  if (DEBUG === true){
    console.log(foodArray)
  }
  if(!(foodArray.length === 0)){
    const randomIndex = Math.floor(Math.random() * foodArray.length);
    const randomElement = foodArray[randomIndex];
    let randomArray = []
    randomArray.push(randomElement);
    console.log(filterById(randomArray, filterById(foodArray, recipes)));
    foodArray = filterArray(foodArray, randomArray);
    const userInput = readline.question('Are you satisfied with given recipe? [yes/no]');
    if (userInput.toLowerCase() === 'yes'){
      startConversation()
    }
    else if (userInput.toLowerCase() === 'no'){
      finalChoice(foodArray)
    }
    else{
      console.log('Invalid command. Please try again.');
      finalChoice(foodArray);
    }
  }
  else{
    console.log("You were not able to choose any of recipes! Try one more time!");
    startConversation();
  }
}

function chooseHardness(foodArray){
  if (DEBUG === true){
    console.log(foodArray)
  }
  const userInput = readline.question('Select difficulty of dish ("Difficult [1]", "Average[2]", "Simple[3]", "Any[4]", quit[5]): ');
  if (userInput === '1') {
    user_answers["hardness"] = "difficult";
    isVegan(searchTitle(filterById(foodArray, recipes), "difficult", false, "Difficulty",  false))
  } else if (userInput === '2') {
    user_answers["hardness"] = "average";
    isVegan(searchTitle(filterById(foodArray, recipes), "average", false, "Difficulty",  false))
  }
  else if (userInput === '3') {
    user_answers["hardness"] = "simple";
    isVegan(searchTitle(filterById(foodArray, recipes), "simple", false, "Difficulty", false))
  }
  else if (userInput === '4') {
    user_answers["hardness"] = "any";
    isVegan(foodArray)
  }
  else if (userInput === '5') {
    startConversation();
  }
  else {
    console.log('Invalid command. Please try again.');
    chooseHardness()
  }
}


function chooseTypeOfDish(){
  const userInput = readline.question('Select the type of dish ("Main[1]", "Salad[2]", "Dessert[3]","Drink[4]"), "quit[5]": ');
  let SaladType = searchTitle(recipes, "salad", false,  "Type_dish",  true)
  let DessertType = searchTitle(recipes, "dessert", false, "Type_dish",  true)
  let DrinkType = searchTitle(recipes, "drink", false, "Type_dish",  true)
  let notDrinkArray = searchTitle(filterById(DrinkType, recipes), userBehaviour[17]["Keywords"], true,"Title" , true)
  DrinkType = filterArray(DrinkType, notDrinkArray)
  let MainType = searchTitle(recipes, "main", false, "Type_dish")
  if (userInput === '1') {
    user_answers["dishType"] = "main";
    chooseHardness(MainType)
  } else if (userInput === '2') {
    user_answers["dishType"] = "salad";
    chooseHardness(SaladType)
  }
  else if (userInput === '3') {
    user_answers["dishType"] = "dessert";
    chooseHardness(DessertType)
  }
  else if (userInput === '4'){
    user_answers["dishType"] = "drink";
    chooseHardness(DrinkType)
  }
  else if (userInput === '5'){
    startConversation();
  }
  else {
    console.log('Invalid command. Please try again.');
    chooseTypeOfDish()
  }
}


function lactoseIntolerance(foodArray){
  if (DEBUG === true){
    console.log(foodArray)
  }
  const userInput = readline.question('Are you lactose intolerant? [yes/no]');
  let lactoseIntolerantIngredients = searchIngredients(filterById(foodArray,recipes), userBehaviour[7]["Keywords"], true)
  let lactoseIntolerantTitles = searchTitle(filterById(foodArray, recipes), userBehaviour[7]["Keywords"], true)
  let lactoseIntolerantFood = combineAndRemoveDuplicates(lactoseIntolerantIngredients, lactoseIntolerantTitles)
  let lactoseTolerantFood = filterArray(foodArray, lactoseIntolerantFood)

  if (userInput.toLowerCase() === 'yes'){
    console.log(lactoseTolerantFood);
    glutenIntolerance(lactoseTolerantFood);
  }
  else if (userInput.toLowerCase() === 'no'){
    glutenIntolerance(foodArray);
  }
  else{
    console.log('Invalid command. Please try again.');
    lactoseIntolerance(foodArray);
  }
}

function glutenIntolerance(foodArray){
  if (DEBUG === true){
    console.log(foodArray)
  }
  const userInput = readline.question('Are you gluten intolerant? [yes/no]');
  let glutenIntolerantIngredients = searchIngredients(filterById(foodArray,recipes), userBehaviour[8]["Keywords"], true)
  let glutenIntolerantTitles = searchTitle(filterById(foodArray, recipes), userBehaviour[8]["Keywords"], true)
  let glutenIntolerantFood = combineAndRemoveDuplicates(glutenIntolerantIngredients, glutenIntolerantTitles)
  let glutenTolerantFood = filterArray(foodArray, glutenIntolerantFood)

  if (userInput.toLowerCase() === 'yes'){
    sugarAmount(glutenTolerantFood)
  }
  else if (userInput.toLowerCase() === 'no'){
    sugarAmount(foodArray)
  }
  else{
    console.log('Invalid command. Please try again.');
    lactoseIntolerance(foodArray);
  }
}


function ingredientsPreference(foodArray, wish = true) {
  if (DEBUG === true){
    console.log(foodArray)
  }
  if (wish === true){
    const userInput = readline.question('Write list of products separated by commas, which you want to be in your dish ' +
        '\n if there are no such products, leave field empty.');
    if(userInput === ""){
      user_answers["wantedProducts"] = false;
      ingredientsPreference(foodArray, false)
    }
    else{
      user_answers["wantedProducts"] = true;
      ingredientsPreference(searchIngredients(filterById(foodArray, recipes), stringToArray(userInput), true), false);
    }
  }

  else{
    const userInput = readline.question('Write list of products separated by commas, which you do not want to be in your dish ' +
        '\n if there are no such products, leave field empty (besides lactose).');
    if(userInput === ""){
      user_answers["unWantedProducts"] = false;
      isFoodSpicy(foodArray)
    }
    else{
      user_answers["unWantedProducts"] = true;
      isFoodSpicy(filterArray(foodArray, searchIngredients(filterById(foodArray, recipes),stringToArray(userInput), true)));
    }
  }
}

function meatPreference(foodArray) {
  if (DEBUG === true) {
    console.log(foodArray)
  }
  if (!(user_answers["dishType"] === "drink" || user_answers["dishType"] === "dessert")) {
    const userInput = readline.question('Do you have any meat preferences? Write a comma-separated list ' +
        '\n if there are no specific preferences, leave field empty.');
    let meat_types = userBehaviour[9]["Keywords"].map((element) => element.toLowerCase());
    if (userInput === "") {
      user_answers["meatPreference"] = false;
      ingredientsPreference(foodArray, true)
    } else {
      let userInputArray = stringToArray(userInput)
      let notIncludeFlag = false;
      let falseMeat = ""
      for (let i = 0; i < userInputArray.length; i++) {
        if (!meat_types.includes(userInputArray[i])) {
          notIncludeFlag = true
          falseMeat += userInputArray[i] + " "
        }
      }
      if (notIncludeFlag === true) {
        falseMeat = falseMeat.trim()
        console.log(`You have entered incorrect meat name "${falseMeat}"! Try again please!`)
        meatPreference(foodArray)
      } else {
        user_answers["meatPreference"] = true;
        ingredientsPreference(searchIngredients(filterById(foodArray, recipes), stringToArray(userInput), true), true);
      }
    }
  }
  else{
    ingredientsPreference(foodArray)
  }
}

function vegetablePreference(foodArray){
  if (DEBUG === true){
    console.log(foodArray)
  }
  const userInput = readline.question('Do you want vegetables to be in? [yes/no/any]');
  if (userInput.toLowerCase() === 'yes'){
    user_answers["vegetablesIn"] = true;
    lactoseIntolerance(foodArray);
  }
  else if (userInput.toLowerCase() === 'no'){
    let foodWithVegetable = searchIngredients(filterById(foodArray, recipes), userBehaviour[10]["Keywords"], true);
    let foodWithoutVegetable = filterArray(foodArray, foodWithVegetable)
    user_answers["vegetablesIn"] = false;
    lactoseIntolerance(foodWithoutVegetable)
  }
  else if (userInput.toLowerCase() === 'any'){
    lactoseIntolerance(foodArray)
  }
  else{
    console.log('Invalid command. Please try again.');
    vegetablePreference()
  }
}

function  isFoodSpicy(foodArray){
  if (DEBUG === true){
    console.log(foodArray)
  }
  let spicyIngredients = searchIngredients(filterById(foodArray, recipes), userBehaviour[5]["Keywords"], true)
  let spicyTitles = searchTitle(filterById(foodArray, recipes), userBehaviour[6]["Keywords"], true)
  let spicyFood = combineAndRemoveDuplicates(spicyIngredients, spicyTitles)
  let notSpicyFood = filterArray(foodArray, spicyFood)

  if (!(user_answers["dishType"] === "drink" || user_answers["dishType"] === "dessert")) {
    const userInput = readline.question('Do you want food to be spicy? [yes/no/any]');
    if (userInput.toLowerCase() === 'yes') {
      user_answers["isSpicy"] = true;
      vegetablePreference(spicyFood);
    } else if (userInput.toLowerCase() === 'no') {
      user_answers["isSpicy"] = false;
      vegetablePreference(notSpicyFood);
    } else if (userInput.toLowerCase() === 'any') {
      vegetablePreference(foodArray)
    } else {
      console.log('Invalid command. Please try again.');
      isFoodSpicy(foodArray);
    }
  }
  else{
    lactoseIntolerance(foodArray)
  }
}


function isVegan(foodArray) {
  if (DEBUG === true){
    console.log(foodArray)
  }
  const userInput = readline.question('Are you vegan? [yes/no]');

  let veganFood = searchTitle(filterById(foodArray, recipes), "true", false, "Vegan");

  if (userInput.toLowerCase() === 'yes'){
    user_answers["isVegan"] = true;
    ingredientsPreference(veganFood);
  }
  else if (userInput.toLowerCase() === 'no'){
    user_answers["isVegan"] = false;
    meatPreference(foodArray);
  }
  else{
    console.log(get_response(""))
    isVegan(foodArray)
  }
}

function sugarAmount(foodArray){
  if (DEBUG === true){
    console.log(foodArray)
  }
  const userInput = readline.question('Do you want recipe to be sweet (with sugar)?[yes/no/any]');
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

  if(userInput.toLowerCase() === 'yes'){
    finalChoice(sweetRecipes)
  }
  if(userInput.toLowerCase() === 'no'){
    finalChoice(notSweetRecipes)
  }
  if(userInput.toLowerCase() === 'any'){
    finalChoice(foodArray)
  }
  else{
    sugarAmount(foodArray);
    console.log(get_response(""))
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