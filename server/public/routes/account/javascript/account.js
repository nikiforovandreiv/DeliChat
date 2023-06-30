// Create signin status
let is_signin = true;

// Create is row status
let is_row = true;

// Get the width and height of the window
let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;

// constant variables to calculate the ratio of width and height
const accountHeightDefault = 14;
const accountLeftWidthDefault = 11.2;
const accountRightWidthDefault = 9.6;

// calculation of constant ratio of width and height
const accountLeftProportion = accountLeftWidthDefault / accountHeightDefault;
const accountRightProportion = accountRightWidthDefault / accountHeightDefault;

// Get the body element
const body = document.getElementById("body");

// Get the topEmptySpace element
const topEmptySpace = document.getElementById("top_empty_space");

// Get the accountLeft and accountRight elements
const accountLeft = document.getElementById("account_left");
const accountRight = document.getElementById("account_right");

// Get the containerAccount Pan and Pie elements for row and column
const containerAccountPanRow = document.getElementById("container_account_pan_row");
const containerAccountPieRow = document.getElementById("container_account_pie_row");
const containerAccountPanColumn = document.getElementById("container_account_pan_column");
const containerAccountPieColumn = document.getElementById("container_account_pie_column");

const intermediateAccountPanColumn = document.getElementById("intermediate_account_pan_column");
const intermediateAccountPieColumn = document.getElementById("intermediate_account_pie_column");

// Get the container sign elements
const signInOptionButton = document.getElementById("sign_in_option_button");
const signUpOptionButton = document.getElementById("sign_up_option_button");
const containerSignInput = document.getElementById("container_sign_input");
const containerSignInForget = document.getElementById("container_signin_forget");
const signInInputForm = document.getElementById("sign_in_input_form");
const signUpInputForm = document.getElementById("sign_up_input_form");
const signInDisplay = document.getElementById("sign_in_display");
const signUpDisplay = document.getElementById("sign_up_display");
const signInputInput = document.getElementsByClassName("sign_input_input");
const signUpRepeatPassword = document.getElementById("sign_up_repeat_password");
const signInButton = document.getElementById("sign_in_button");
const signUpButton = document.getElementById("sign_up_button");

function setSizeOfLeftAndRight() {
    // Update the width and height of the window
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;

    // Calculate the welcomeLeft and welcomeRight height
    let accountLeftHeight = windowHeight * (14/18);
    let accountRightHeight = windowHeight * (14/18);

    // Calculate the welcomeLeft and welcomeRight width
    let accountLeftWidth = accountLeftHeight * accountLeftProportion;
    let accountRightWidth = accountRightHeight * accountRightProportion;

    // Set the accountLeft width and height
    accountLeft.style.width = `${accountLeftWidth}px`;
    accountLeft.style.height = `${accountLeftHeight}px`;

    intermediateAccountPanColumn.style.width = `${accountLeftWidth}px`;
    intermediateAccountPieColumn.style.width = `${accountLeftWidth}px`;

    // Set the accountRight width and height
    accountRight.style.width = `${accountRightWidth}px`;
    accountRight.style.height = `${accountRightHeight}px`;
}

// Function to handle resizing
function changeSize() {
    // Update the width and height of the window
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;

    // column
    if (window.innerWidth <= window.innerHeight * 1.5) {
        is_row = false;
    }
    // row
    else {
        is_row = true;
        topEmptySpace.scrollIntoView({ behavior: "auto" });
    }
}

function setStatusProperties() {
    containerAccountPieRow.style.display = "none";
    containerAccountPieColumn.style.display = "none";
    containerAccountPanRow.style.display = "none";
    containerAccountPanColumn.style.display = "none";
    if (is_signin) {
        signInDisplay.style.display = "flex";
        signUpDisplay.style.display = "none";
        signInInputForm.style.display = "flex"
        signUpInputForm.style.display = "none";
        containerSignInput.style.height = "calc(2.5/12 * 100%)";
        containerSignInForget.style.display = "flex";

        if (is_row) {
            containerAccountPanRow.style.display = "flex";
        } else {
            containerAccountPanColumn.style.display = "flex";
        }
    } else {
        signInDisplay.style.display = "none";
        signUpDisplay.style.display = "flex";
        signInInputForm.style.display = "none"
        signUpInputForm.style.display = "flex";
        signUpRepeatPassword.style.display = "flex";
        containerSignInput.style.height = "calc(4/12 * 100%)";
        containerSignInForget.style.display = "none";
        if (is_row) {
            containerAccountPieRow.style.display = "flex";
        } else {
            containerAccountPieColumn.style.display = "flex";
        }
    }
}

signInOptionButton.addEventListener('click', function () {
    is_signin = true;
    signInOptionButton.style.color = "#df613d";
    signUpOptionButton.style.color = "#ec8a5e";
    setStatusProperties();
});

signUpOptionButton.addEventListener('click', function () {
    is_signin = false;
    signInOptionButton.style.color = "#ec8a5e";
    signUpOptionButton.style.color = "#df613d";
    setStatusProperties();
});

for (let i = 0; i < signInputInput.length; i++) {
    signInputInput[i].addEventListener('keydown', function(event) {
        if (event.keyCode === 32) { // keyCode 32 corresponds to the spacebar
            event.preventDefault(); // Prevents the space character from being entered
        }
    });
}

function checkInputValidity(email, password) {
    // Check for empty email and password fields
    if (email.trim() === '') {
        console.log('Email field is empty');
        return false; // Return false if email field is empty
    }
    if (password.trim() === '') {
        console.log('Password field is empty');
        return false; // Return false if password field is empty
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        console.log('Invalid email format');
        return false; // Return false if email format is invalid
    }
    return true; // Return true if all checks were passed
}

signInButton.addEventListener('click', () => {
    const formData = new FormData(signInInputForm);

    const email = "" + formData.get('sign_in_email');
    const password = "" + formData.get('sign_in_password');

    if (!checkInputValidity(email, password)) {
        return; // // Stop execution if checkInputValidity is false
    }

    const data = {
        email,
        password
    };

    fetch('/account/signin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('Sign in successful');
                window.location.href = "/chat";
            } else {
                console.log('Sign in failed');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

signUpButton.addEventListener('click', () => {
    const formData = new FormData(signUpInputForm);

    let email = "" + formData.get('sign_up_email');
    let password = "" + formData.get('sign_up_password');
    let repeatPassword = "" + formData.get('sign_up_repeat_password');

    if (!checkInputValidity(email, password)) {
        return; // Stop execution if checkInputValidity is false
    }

    if (password !== repeatPassword) {
        return; // Stop execution if passwords are not the same
    }

    const data = {
        email,
        password,
        repeatPassword
    };

    fetch('/account/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('Sign up successful');
                window.location.href = "/chat";
            } else {
                console.log('Sign up failed');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

changeSize();
setSizeOfLeftAndRight();
setStatusProperties();

window.addEventListener("resize", function() {
    changeSize();
    setSizeOfLeftAndRight();
    setStatusProperties();
});
