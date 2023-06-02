let isMenuOpen = true;

// Get the width and height of the window
let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;

// constant variables to calculate the ratio of width and height
const containerChatMenuHeightDefault = 18;
const containerChatMenuWidthDefault = 9.4;

// constant variables to calculate the ratio of width and height
const containerChatWorkfieldHeightDefault = 18;
const containerChatWorkfieldWidthDefault = 22.6;

// calculation of constant ratio of width and height
const containerChatMenuProportion = containerChatMenuWidthDefault / containerChatMenuHeightDefault;

// calculation of constant ratio of width and height
const containerChatWorkfieldProportion = containerChatWorkfieldWidthDefault / containerChatWorkfieldHeightDefault;

// Get the body element
const body = document.getElementById("body");

// Get the containerChat element
const containerChat = document.getElementById("container_chat");

// Get the containerChatMenu and containerChatChat elements
const containerChatMenu = document.getElementById("container_chat_menu");
const containerChatWorkfield = document.getElementById("container_chat_workfield");

const containerDisplayOption = document.getElementById("container_display_option");
const displayOptionCloseButton = document.getElementById("display_option_close_button");
const displayOptionOpenButton = document.getElementById("display_option_open_button");

// Get the containerNotes elements
const containerNotes = document.getElementById("container_notes");
const intermediateNotes = document.getElementById("intermediate_notes");
const intermediateNotesLeft = document.getElementById("intermediate_notes_left");
const intermediateNotesMid = document.getElementById("intermediate_notes_mid");
const containerNote = document.getElementById("container_note");
const intermediateNotesScrollbar = document.getElementById("intermediate_notes_scrollbar");
const notesScrollbar = document.getElementById("notes_scrollbar");

// Get the chatMenu and chatChat elements
const chatMenu = document.getElementById("chat_menu");
const intermediateChatWorkfield = document.getElementById("intermediate_chat_workfield");
const chatWorkfieldUserEmail = document.getElementById("chat_workfield_user_email");

const chatWorkDialogue = document.getElementById("chat_work_dialogue");
const chatWorkDialogueUserMessage = document.getElementsByClassName("chat_work_dialogue_user_message");
const chatWorkDialogueBotMessage = document.getElementsByClassName("chat_work_dialogue_bot_message");

// Get the chatWorkInputInput element
const chatWorkInputInput = document.getElementById("chat_work_input_input");
// Get the chatWorkInputSendButton element
const chatWorkInputSendButton = document.getElementById("chat_work_input_send_button");

// Get the containerChatWorkDialogueScrollbar and chatWorkfieldScrollbar elements
const containerChatWorkDialogueScrollbar = document.getElementById("container_chat_work_dialogue_scrollbar");
const chatWorkDialogueScrollbar = document.getElementById("chat_work_dialogue_scrollbar");

let email = "default_email@gmail.com";

fetch('/api/session')
    .then(response => response.json())
    .then(data => {
        email = data.email;
        // Use the retrieved session data in your page.js file as needed
        console.log(` Email: ${email}`);
        chatWorkfieldUserEmail.textContent = email.toString();
    })
    .catch(error => {
        console.error('Error retrieving session data:', error);
    });

// Function to send message
function sendMessageToServer(message) {
    fetch('/api/message', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message })
    })
        .then(response => response.json())
        .then(data => {

            console.log('Message sent to server');
            // Perform any other necessary actions
        })
        .catch(error => {
            console.error('Error sending message to server:', error);
        });
}

function sendNoteToServer(email, note_content) {
    fetch('/chat/addNote', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, note_content })
    })
        .then(response => response.json())
        .then(data => {
            console.log('Note sent to server');
            // Perform any other necessary actions
        })
        .catch(error => {
            console.error('Error sending message to server:', error);
        });
}

function deleteNoteOnTheServer(email, note_content) {
    fetch('/chat/deleteNote', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, note_content })
    })
        .then(response => response.json())
        .then(data => {
            console.log('Note deleted from the server');
            // Perform any other necessary actions
        })
        .catch(error => {
            console.error('Error deleting note from the server:', error);
        });
}

function setSizeOfLeftAndRight() {
    // Update the width and height of the window
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;
}

function changeSize() {
    // Update the width and height of the window
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;

    // column
    if (window.innerWidth <= window.innerHeight * 1.5) {
    }
    // row
    else {
    }
}

function changeSizeOfTextarea() {
    chatWorkInputInput.style.height = "auto";
    chatWorkInputInput.style.height = chatWorkInputInput.scrollHeight + 'px';

    // Scroll to the top of the textarea
    chatWorkInputInput.slTop = 0;
}

function changeSizeOfChatWorkDialogueMessage() {
    let chatWorkDialogueWidth = chatWorkDialogue.offsetWidth;
    let chatWorkDialogueHeight = chatWorkDialogue.offsetHeight;
    let likeButtons = document.getElementsByClassName("like-button");
    for (let i = 0; i < chatWorkDialogueUserMessage.length; i++) {
        chatWorkDialogueUserMessage[i].style.maxWidth = chatWorkDialogueWidth * 0.8 + "px";
        chatWorkDialogueUserMessage[i].style.marginBottom = chatWorkDialogueHeight * 0.05 + "px";
        for (let i = 0; i < likeButtons.length; i++) {
            likeButtons[i].style.marginBottom = chatWorkDialogueHeight * 0.05 + "px";
            likeButtons[i].style.marginLeft = chatWorkDialogueHeight * 0.025 + "px";
        }
    }
    for (let i = 0; i < chatWorkDialogueBotMessage.length; i++) {
        chatWorkDialogueBotMessage[i].style.maxWidth = chatWorkDialogueWidth * 0.8 + "px";
        chatWorkDialogueBotMessage[i].style.marginBottom = chatWorkDialogueHeight * 0.05 + "px";
    }
}

function sendMessage() {
    let message = chatWorkInputInput.value.trim();
    // Additional code or actions can be performed here
    if (message !== "") {
        // Create a new div element
        let containerNewUserMessage = document.createElement("div");
        let newUserMessage = document.createElement("div");

        // Set attributes, classes for the new div
        containerNewUserMessage.classList.add("container_chat_work_dialogue_user_message");
        newUserMessage.classList.add("chat_work_dialogue_user_message");

        // Create the inner p element
        let newUserMessageP = document.createElement("p");
        newUserMessageP.classList.add("chat_work_dialogue_user_message_p");
        newUserMessageP.dataset.value = "26";
        newUserMessageP.textContent = message;

        // Append the p element to the div element
        newUserMessage.appendChild(newUserMessageP);

        containerNewUserMessage.appendChild(newUserMessage);

        // Append the new div as a child to the parent div
        chatWorkDialogue.appendChild(containerNewUserMessage);

        // Send message to the server
        sendMessageToServer(message);

        // Create a new div element
        let containerNewBotMessage = document.createElement("div");
        let newBotMessage = document.createElement("div");

        // Set attributes, classes for the new div
        containerNewBotMessage.classList.add("container_chat_work_dialogue_bot_message");
        newBotMessage.classList.add("chat_work_dialogue_bot_message");

        // Create the inner p element
        let newBotMessageP = document.createElement("p");
        newBotMessageP.classList.add("chat_work_dialogue_bot_message_p");
        newBotMessageP.dataset.value = "26";
        newBotMessageP.textContent = "Yes, you are" + " " + message;

        /*
        <div className="like-button">
            <div className="heart-bg">
                <div className="heart-icon"></div>
            </div>
        </div>
         */
        // Create the inner like element
        let newBotMessageLike = document.createElement("div");
        newBotMessageLike.classList.add("like-button");
        let newBotMessageLikeHeartBG = document.createElement("div");
        newBotMessageLikeHeartBG.classList.add("heart-bg");
        let newBotMessageLikeHeartIcon = document.createElement("div");
        newBotMessageLikeHeartIcon.classList.add("heart-icon");

        newBotMessageLikeHeartBG.appendChild(newBotMessageLikeHeartIcon);
        newBotMessageLike.appendChild(newBotMessageLikeHeartBG);

        newBotMessageLikeHeartIcon.addEventListener("click", () => {
            if (!newBotMessageLikeHeartIcon.classList.contains("liked")) {
                newBotMessageLikeHeartIcon.classList.add("liked");
                const noteContent = newBotMessageLikeHeartIcon.closest(".like-button").previousElementSibling.querySelector(".chat_work_dialogue_bot_message_p").textContent;
                console.log(noteContent);
                sendNoteToServer(email, noteContent);
                addNote(noteContent);
            } else {
                newBotMessageLikeHeartIcon.classList.remove("liked");
                const noteContent = newBotMessageLikeHeartIcon.closest(".like-button").previousElementSibling.querySelector(".chat_work_dialogue_bot_message_p").textContent;
                console.log(noteContent);
                deleteNoteOnTheServer(email, noteContent);
                deleteNote(noteContent);
            }
        });

        // Append the p element to the div element
        newBotMessage.appendChild(newBotMessageP);

        // Append the like element to the div element
        containerNewBotMessage.appendChild(newBotMessage);
        containerNewBotMessage.appendChild(newBotMessageLike);

        // Append the new div as a child to the parent div
        chatWorkDialogue.appendChild(containerNewBotMessage);

        chatWorkDialogue.scrollTop = chatWorkDialogue.scrollHeight;
        chatWorkInputInput.value = "";

        changeSizeOfChatWorkDialogueScrollbar();
        changeSizeOfIntermediateNotesMidScrollbar();
    }
}

function addNote(noteContent) {
    // Create a new div element
    let newIntermediateNote = document.createElement("div");
    let newNote = document.createElement("div");
    let newNoteMessage = document.createElement("p");
    let newDeleteNote = document.createElement("div");
    let newDeleteNoteButton = document.createElement("button");
    let newDeleteNoteImg = document.createElement("img");

    // Set attributes, classes for the new div
    newIntermediateNote.classList.add("intermediate_note");
    newNote.classList.add("note");
    newNoteMessage.classList.add("note_p");
    newNoteMessage.dataset.value = "26";
    newNoteMessage.textContent = noteContent;
    newDeleteNote.classList.add("delete_note");
    newDeleteNoteButton.classList.add("delete_note_button");
    newDeleteNoteImg.classList.add("delete_note_img");
    newDeleteNoteImg.src = "/front/img/delete_note.png";
    newDeleteNoteImg.alt = "Delete Note";

    // Append the p element to the div element
    newNote.appendChild(newNoteMessage);

    newDeleteNoteButton.appendChild(newDeleteNoteImg);
    newDeleteNote.appendChild(newDeleteNoteButton);

    newIntermediateNote.appendChild(newNote);
    newIntermediateNote.appendChild(newDeleteNote);

    containerNote.appendChild(newIntermediateNote);

    newDeleteNoteButton.addEventListener("click", () => {
        const noteContent = newDeleteNoteButton.closest(".intermediate_note").querySelector(".note_p").textContent;
        console.log(noteContent);
        deleteNoteOnTheServer(email, noteContent);
        deleteNote(noteContent);
        const chatWorkDialogueBotMessagesP = document.getElementsByClassName("chat_work_dialogue_bot_message_p");
        for (let i = 0; i < chatWorkDialogueBotMessagesP.length; i++) {
            if (chatWorkDialogueBotMessagesP[i].textContent === noteContent) {
                let likeButton = chatWorkDialogueBotMessagesP[i].closest('.container_chat_work_dialogue_bot_message').querySelector('.like-button').querySelector(".heart-bg").querySelector(".heart-icon");
                likeButton.classList.remove("liked");
            }
        }
    });
    multiplyTextSize();
    changeSizeOfIntermediateNotesMidScrollbar();
}

function deleteNote(noteContent) {
    // Get all intermediate_note elements within container_note
    const intermediateNotes = containerNote.getElementsByClassName("intermediate_note");

    // Iterate through each intermediate_note
    for (let i = 0; i < intermediateNotes.length; i++) {
        const intermediateNote = intermediateNotes[i];
        const noteP = intermediateNote.querySelector(".note_p");

        // Check if the text of note_p matches the desired value
        if (noteP.textContent === noteContent) {
            // Remove the intermediate_note from container_note
            intermediateNote.parentNode.removeChild(intermediateNote);
        }
    }
}

changeSize();
changeSizeOfTextarea();
changeSizeOfChatWorkDialogueMessage();
setSizeOfLeftAndRight();

chatWorkInputInput.addEventListener('input', () => {
    changeSizeOfTextarea();
    changeSizeOfChatWorkDialogueMessage();
});

chatWorkInputInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        sendMessage();
        changeSizeOfTextarea();
        changeSizeOfChatWorkDialogueMessage();
        multiplyTextSize();
        chatWorkDialogue.scrollTop = chatWorkDialogue.scrollHeight;
    }
});

chatWorkInputSendButton.addEventListener('click', function() {
    sendMessage();
    changeSizeOfTextarea();
    changeSizeOfChatWorkDialogueMessage();
    multiplyTextSize();
    chatWorkDialogue.scrollTop = chatWorkDialogue.scrollHeight;
});

displayOptionCloseButton.addEventListener('click', function() {
    isMenuOpen = false;
    let containerChatMenuInitialWidth = containerChatMenu.offsetWidth;
    let containerChatMenuNewWidth = containerChatMenu.offsetWidth; // Get the current width of the element
    let containerChatWorkfieldNewWidth = containerChatWorkfield.offsetWidth; // Get the current width of the element
    const duration = 1000; // Animation duration in milliseconds
    const frameRate = 60; // Target frame rate
    const frameWidth = containerChatMenuNewWidth / (duration / 1000 * frameRate); // Width to decrease in each frame

    function animate() {
        containerChatMenuNewWidth -= frameWidth; // Decrease the width by the frame width
        containerChatWorkfieldNewWidth += frameWidth; // Increase the width by the frame width
        containerChatMenu.style.width = containerChatMenuNewWidth + 'px'; // Update the element's width

        changeSizeOfTextarea();
        changeSizeOfChatWorkDialogueMessage();

        if (containerChatMenuNewWidth <= containerChatMenuInitialWidth / 2) {
            containerChatWorkfield.style.marginLeft = (containerChatMenuInitialWidth / 2 - containerChatMenu.offsetWidth).toString() + "px";
        }

        if (containerChatMenuNewWidth <= 0) {
            containerChatMenu.style.width = '0';
            containerChatMenu.style.display = "none";
            containerChatWorkfield.style.marginLeft = "0";
            containerChat.style.justifyContent = "center";
            displayOptionCloseButton.style.display = "none";
            displayOptionOpenButton.style.display = "flex";
            return; // Stop the animation when width reaches 0
        }

        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
});

displayOptionOpenButton.addEventListener('click', function() {
    isMenuOpen = true;
    containerChatMenu.style.display = "flex";
    const containerChatMenuWidth = containerChatMenuWidthDefault/32 * window.innerWidth;
    containerChatWorkfield.style.marginLeft = (containerChatMenuWidth / 2).toString() + "px";
    containerChat.style.justifyContent = "flex-start";
    let width = 0;
    const duration = 1000; // Animation duration in milliseconds
    const frameRate = 60; // Target frame rate
    const frameWidth = containerChatMenuWidth / (duration / 1000 * frameRate); // Width to increase in each frame

    function animate() {
        width += frameWidth; // Increase the width by the frame width
        containerChatMenu.style.width = width + 'px'; // Update the element's width

        changeSizeOfTextarea();
        changeSizeOfChatWorkDialogueMessage();

        if (width <= containerChatMenuWidth / 2) {
            containerChatWorkfield.style.marginLeft = (containerChatMenuWidth / 2 - containerChatMenu.offsetWidth).toString() + "px";
        }

        if (width >= containerChatMenuWidth) {
            containerChatWorkfield.style.marginLeft = "0";
            containerChatMenu.style.width = containerChatMenuWidth + "px";
            displayOptionCloseButton.style.display = "flex";
            displayOptionOpenButton.style.display = "none";
            return; // Stop the animation when width reaches the target width
        }

        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
});


function changeSizeOfChatWorkDialogueScrollbar() {
    let chatWorkDialogueFullHeight = chatWorkDialogue.scrollHeight;
    let chatWorkDialogueVisibleHeight = chatWorkDialogue.offsetHeight;
    let chatWorkDialogueScrollableHeight = chatWorkDialogue.scrollTop;
    let containerChatWorkDialogueScrollbarHeight = containerChatWorkDialogueScrollbar.offsetHeight;
    if (chatWorkDialogueVisibleHeight < chatWorkDialogueFullHeight) {
        chatWorkDialogueScrollbar.style.display = "flex";
        chatWorkDialogueScrollbar.style.height = (chatWorkDialogueVisibleHeight / chatWorkDialogueFullHeight * 100) + "%";
        let percentageValue = (chatWorkDialogueScrollableHeight / chatWorkDialogueFullHeight);
        chatWorkDialogueScrollbar.style.marginTop = (containerChatWorkDialogueScrollbarHeight * percentageValue) + "px";
    }
}

function changeSizeOfIntermediateNotesMidScrollbar() {
    let containerNoteFullHeight = containerNote.scrollHeight;
    let containerNoteVisibleHeight = containerNote.offsetHeight;
    let containerNoteScrollableHeight = containerNote.scrollTop;
    let intermediateNotesScrollbarHeight = intermediateNotesScrollbar.offsetHeight;
    if (containerNoteVisibleHeight < containerNoteFullHeight) {
        notesScrollbar.style.display = "flex";
        notesScrollbar.style.height = (containerNoteVisibleHeight / containerNoteFullHeight * 100) + "%";
        let percentageValue = (containerNoteScrollableHeight / containerNoteFullHeight);
        notesScrollbar.style.marginTop = (intermediateNotesScrollbarHeight * percentageValue) + "px";
    }
}

chatWorkDialogue.addEventListener('scroll', changeSizeOfChatWorkDialogueScrollbar);
containerNote.addEventListener('scroll', changeSizeOfIntermediateNotesMidScrollbar);

let isMouseDownChatWorkDialogue = false;
let isMouseDownContainerNote = false;
let startYChatWorkDialogue = 0;
let startYContainerNote = 0;


document.addEventListener('mousedown', handleMouseDown);
document.addEventListener('mouseup', handleMouseUp);
document.addEventListener('mouseleave', handleMouseUp);
document.addEventListener('mousemove', handleMouseMove);

function handleMouseDown(event) {
    if (event.target === containerChatWorkDialogueScrollbar || event.target === chatWorkDialogueScrollbar) {
        isMouseDownChatWorkDialogue = true;
        startYChatWorkDialogue = event.clientY;
    } else if (event.target === intermediateNotesScrollbar || event.target === notesScrollbar) {
        isMouseDownContainerNote = true;
        startYContainerNote = event.clientY;
    }
}

function handleMouseUp() {
    isMouseDownChatWorkDialogue = false;
    isMouseDownContainerNote = false;
}

function handleMouseMove(event) {
    if (isMouseDownChatWorkDialogue) {
        const deltaY = event.clientY - startYChatWorkDialogue;
        startYChatWorkDialogue = event.clientY;
        const maxScrollTop = containerChatWorkDialogueScrollbar.offsetHeight - chatWorkDialogueScrollbar.offsetHeight;
        const newMarginTop = Math.min(Math.max(parseFloat(chatWorkDialogueScrollbar.style.marginTop) + deltaY, 0), maxScrollTop);
        chatWorkDialogueScrollbar.style.marginTop = newMarginTop + "px";
        const percentageValue = newMarginTop / maxScrollTop;
        chatWorkDialogue.scrollTop = (chatWorkDialogue.scrollHeight - chatWorkDialogue.offsetHeight) * percentageValue;
    } else if (isMouseDownContainerNote) {
        const deltaY = event.clientY - startYContainerNote;
        startYContainerNote = event.clientY;
        const maxScrollTop = intermediateNotesScrollbar.offsetHeight - notesScrollbar.offsetHeight;
        const newMarginTop = Math.min(Math.max(parseFloat(notesScrollbar.style.marginTop) + deltaY, 0), maxScrollTop);
        notesScrollbar.style.marginTop = newMarginTop + "px";
        const percentageValue = newMarginTop / maxScrollTop;
        containerNote.scrollTop = (containerNote.scrollHeight - containerNote.offsetHeight) * percentageValue;
    }
}

const heartIcons = document.querySelectorAll(".like-button .heart-icon");

heartIcons.forEach((heartIcon) => {
    heartIcon.addEventListener("click", () => {
        if (!heartIcon.classList.contains("liked")) {
            heartIcon.classList.add("liked");
            const noteContent = heartIcon.closest(".like-button").previousElementSibling.querySelector(".chat_work_dialogue_bot_message_p").textContent;
            console.log(noteContent);
            sendNoteToServer(email, noteContent);
            addNote(noteContent);
        } else {
            heartIcon.classList.remove("liked");
            const noteContent = heartIcon.closest(".like-button").previousElementSibling.querySelector(".chat_work_dialogue_bot_message_p").textContent;

            console.log(noteContent);
            deleteNoteOnTheServer(email, noteContent);
            deleteNote(noteContent);
        }
    });
});

window.addEventListener("resize", function() {
    changeSize();
    changeSizeOfTextarea();
    changeSizeOfChatWorkDialogueMessage();
    setSizeOfLeftAndRight();
});