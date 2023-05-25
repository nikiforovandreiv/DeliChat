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

// Get the containerMain element
const containerMain = document.getElementById("container_main");

// Get the containerAccountLeft and containerAccountRight elements
const containerAccountLeft = document.getElementById("container_account_left");
const containerAccountRight = document.getElementById("container_account_right");

// Get the accountLeft and accountRight elements
const accountLeft = document.getElementById("account_left");
const accountRight = document.getElementById("account_right");

// Get the containerNavigationRow and containerNavigationColumn elements
const containerNavigationRow = document.getElementById("container_navigation_row");
const containerNavigationColumn = document.getElementById("container_navigation_column");

// Get the containerWelcomeLogo and intermediateWelcomeLogo elements
const containerWelcomeLogo = document.getElementById("container_welcome_logo");
const intermediateWelcomeLogo = document.getElementById("intermediate_welcome_logo");

// Get the containerAccountLogo and intermediateAccountLogo elements
const containerAccountLogo = document.getElementsByClassName("container_account_logo");
const intermediateAccountLogo = document.getElementsByClassName("intermediate_account_logo");

// Get the containerAccount Pan and Pie elements for row and column
const containerAccountPanRow = document.getElementById("container_account_pan_row");
const containerAccountPieRow = document.getElementById("container_account_pie_row");
const containerAccountPanColumn = document.getElementById("container_account_pan_column");
const containerAccountPieColumn = document.getElementById("container_account_pie_column");

// Get the container sign elements
const containerSign = document.getElementById("container_sign");
const containerSignOption = document.getElementById("container_sign_option");
const intermediateSignOption = document.getElementById("intermediate_sign_option");
const signInOptionButton = document.getElementById("sign_in_option_button");
const signUpOptionButton = document.getElementById("sign_up_option_button");
const containerSignInput = document.getElementById("container_sign_input");
const containerSignInForget = document.getElementById("container_signin_forget");
const signInInputForm = document.getElementById("sign_in_input_form");
const signUpInputForm = document.getElementById("sign_up_input_form");
const signInDisplay = document.getElementById("sign_in_display");
const signUpDisplay = document.getElementById("sign_up_display");
const signInputInput = document.getElementsByClassName("sign_input_input");
const signInEmail = document.getElementById("sign_in_email");
const signInPassword = document.getElementById("sign_in_password");
const signUpEmail = document.getElementById("sign_up_email");
const signUpPassword = document.getElementById("sign_up_password");
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
    accountLeft.style.width = accountLeftWidth.toString() + "px";
    accountLeft.style.height = accountLeftHeight.toString() + "px";

    // Set the accountRight width and height
    accountRight.style.width = accountRightWidth.toString() + "px";
    accountRight.style.height = accountRightHeight.toString() + "px";
}

function changeSize() {
    // Update the width and height of the window
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;

    // column
    if (window.innerWidth <= window.innerHeight * 1.4) {
        is_row = false;

        body.style.overflow = "auto"
        body.style.overflowX = "hidden"

        containerMain.style.flexDirection = "column";

        containerAccountLeft.style.width = "100%";
        containerAccountRight.style.width = "100%";

        containerAccountLeft.style.height = "calc(6/18 * 100%)";

        containerAccountLeft.style.alignItems = "center";
        containerAccountRight.style.alignItems = "center";

        accountLeft.style.marginRight = "0";
        accountRight.style.marginLeft = "0";

        containerNavigationColumn.style.display = "flex";
        containerNavigationRow.style.display = "none";

        containerWelcomeLogo.style.height = "calc(14/14 * 100%)";
        containerWelcomeLogo.style.justifyContent = "center";
        containerWelcomeLogo.style.alignItems = "center";
        intermediateWelcomeLogo.style.marginLeft = "0";
        intermediateWelcomeLogo.style.height = "calc(5/6 * 100%)";

        containerSignOption.style.height = "calc(1.5/12 * 100%)";
        containerSignOption.style.justifyContent = "flex-start";
        intermediateSignOption.style.height = "calc(1/1.5 * 100%)";
    }
    // row
    else {
        is_row = true;

        body.style.overflow = "hidden"

        containerMain.style.flexDirection = "row";

        containerAccountLeft.style.width = "50%";
        containerAccountRight.style.width = "50%";

        containerAccountLeft.style.height = "100%";

        containerAccountLeft.style.alignItems = "flex-end";
        containerAccountRight.style.alignItems = "flex-start";

        accountLeft.style.marginRight = "calc(0.8/16 * 100%)";
        accountRight.style.marginLeft = "calc(4/32 * 100%)";

        containerNavigationColumn.style.display = "none";
        containerNavigationRow.style.display = "flex";

        containerWelcomeLogo.style.height = "calc(7/14 * 100%)";
        containerWelcomeLogo.style.justifyContent = "flex-start";
        containerWelcomeLogo.style.alignItems = "flex-start";
        intermediateWelcomeLogo.style.marginLeft = "calc(0.8/11.2 * 100%)";
        intermediateWelcomeLogo.style.height = "calc(5/7 * 100%)";

        containerSignOption.style.height = "calc(3/12 * 100%)";
        containerSignOption.style.justifyContent = "center";
        intermediateSignOption.style.height = "calc(1/3 * 100%)";

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
    let repeat_password = "" + formData.get('sign_up_repeat_password');

    if (!checkInputValidity(email, password)) {
        return; // Stop execution if checkInputValidity is false
    }

    if (password !== repeat_password) {
        return; // Stop execution if passwords are not the same
    }

    const data = {
        email,
        password,
        repeat_password
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
