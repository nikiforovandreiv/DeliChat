let isMenuOpen = true;

// Get the width and height of the window
let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;

// constant variables to calculate the ratio of width and height
const containerChatMenuHeightDefault = 18;
const containerChatMenuWidthDefault = 9.4;

// constant variables to calculate the ratio of width and height
const containerDisplayOptionHeightDefault = 3;
const containerDisplayOptionWidthDefault = 3.5;

// calculation of constant ratio of width and height
const containerChatMenuProportion = containerChatMenuWidthDefault / containerChatMenuHeightDefault;

// calculation of constant ratio of width and height
const containerDisplayOptionProportion = containerDisplayOptionWidthDefault / containerDisplayOptionHeightDefault;

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

// Get the chatMenu and chatChat elements
const chatMenu = document.getElementById("chat_menu");
const chatWorkfield = document.getElementById("chat_workfield");

// Get the chatWorkInputInput element
const chatWorkInputInput = document.getElementById("chat_work_input_input");

function setSizeOfLeftAndRight() {
    // Update the width and height of the window
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;

    // Calculate the containerChatMenu height
    let containerChatMenuHeight = windowHeight * (containerChatMenuHeightDefault/18);

    // Calculate the containerChatMenu width
    let containerChatMenuWidth = containerChatMenuHeight * containerChatMenuProportion;

    // Calculate the containerDisplay height
    let containerDisplayOptionHeight = windowHeight * (containerDisplayOptionHeightDefault/18);

    // Calculate the containerChatMenu width
    let containerDisplayOptionWidth = containerDisplayOptionHeight * containerDisplayOptionProportion;

    if (isMenuOpen) {
        // Set the containerChatMenu width and height
        containerChatMenu.style.width = containerChatMenuWidth.toString() + "px";
        containerChatMenu.style.height = containerChatMenuHeight.toString() + "px";
    }
    // Set the containerChatMenu width and height
    containerDisplayOption.style.width = containerDisplayOptionWidth.toString() + "px";
    containerDisplayOption.style.height = containerDisplayOptionHeight.toString() + "px";

    // Set margin of chatWorkfield same as the width of containerDisplayOption
    chatWorkfield.style.marginRight = containerDisplayOptionWidth + "px";
}

function changeSize() {
    // Update the width and height of the window
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;

    // column
    if (window.innerWidth <= window.innerHeight * 1.4) {
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

changeSize();
changeSizeOfTextarea();
setSizeOfLeftAndRight();

chatWorkInputInput.addEventListener('input', () => {
    changeSizeOfTextarea();
});

chatWorkInputInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        // Additional code or actions can be performed here
    }
});

displayOptionCloseButton.addEventListener('click', function() {
    isMenuOpen = false;
    let width = containerChatMenu.offsetWidth; // Get the current width of the element
    let duration = 500; // Animation duration in milliseconds
    let frameRate = 10; // Interval between each animation frame in milliseconds
    let frameWidth = width / (duration / frameRate); // Width to decrease in each frame

    let animationInterval = setInterval(function() {
        width -= frameWidth; // Decrease the width by the frame width
        containerChatMenu.style.width = width + 'px'; // Update the element's width
        changeSizeOfTextarea();

        if (width <= 0) {
            containerChatMenu.style.width = '0';
            displayOptionCloseButton.style.display = "none";
            displayOptionOpenButton.style.display = "flex";
            clearInterval(animationInterval); // Stop the animation when width reaches 0
        }
    }, frameRate);
});

displayOptionOpenButton.addEventListener('click', function() {
    isMenuOpen = true;
    let containerChatMenuWidth = parseFloat(containerChatMenu.style.height) * containerChatMenuProportion;
    let width = 0;
    let duration = 500; // Animation duration in milliseconds
    let frameRate = 10; // Interval between each animation frame in milliseconds
    let frameWidth = containerChatMenuWidth / (duration / frameRate); // Width to decrease in each frame

    let animationInterval = setInterval(function() {
        width += frameWidth; // Increase the width by the frame width
        containerChatMenu.style.width = width + 'px'; // Update the element's width
        changeSizeOfTextarea();

        if (width >= containerChatMenuWidth) {
            containerChatMenu.style.width = containerChatMenuWidth + "px";
            displayOptionCloseButton.style.display = "flex";
            displayOptionOpenButton.style.display = "none";
            clearInterval(animationInterval); // Stop the animation when width reaches 0
        }
    }, frameRate);
});

window.addEventListener("resize", function() {
    changeSize();
    changeSizeOfTextarea();
    setSizeOfLeftAndRight();
});