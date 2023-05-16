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
const signInOptionButton = document.getElementById("sign_in_option_button");
const signUpOptionButton = document.getElementById("sign_up_option_button");
const containerSignInput = document.getElementById("container_sign_input");
const containerSignInForget = document.getElementById("container_signin_forget");
const containerSignButton = document.getElementById("container_sign_button");
const signInputInput = document.getElementsByClassName("sign_input_input");
const signInDisplay = document.getElementById("sign_in_display");
const signUpDisplay = document.getElementById("sign_up_display");
const email = document.getElementById("email");
const password = document.getElementById("password");
const repeatPassword = document.getElementById("repeat_password");

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

        containerAccountLeft.style.alignItems = "center";
        containerAccountRight.style.alignItems = "center";

        accountLeft.style.marginRight = "0";
        accountRight.style.marginLeft = "0";

        containerNavigationColumn.style.display = "flex";
        containerNavigationRow.style.display = "none";

        containerWelcomeLogo.style.justifyContent = "center";
        containerWelcomeLogo.style.alignItems = "center";
        intermediateWelcomeLogo.style.marginLeft = "0";
    }
    // row
    else {
        is_row = true;

        body.style.overflow = "hidden"

        containerMain.style.flexDirection = "row";

        containerAccountLeft.style.width = "50%";
        containerAccountRight.style.width = "50%";

        containerAccountLeft.style.alignItems = "flex-end";
        containerAccountRight.style.alignItems = "flex-start";

        accountLeft.style.marginRight = "calc(0.8/16 * 100%)";
        accountRight.style.marginLeft = "calc(4/32 * 100%)";

        containerNavigationColumn.style.display = "none";
        containerNavigationRow.style.display = "flex";

        containerWelcomeLogo.style.justifyContent = "flex-start";
        containerWelcomeLogo.style.alignItems = "flex-start";
        intermediateWelcomeLogo.style.marginLeft = "calc(0.8/11.2 * 100%)";
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
        repeatPassword.style.display = "none";
        containerSignInput.style.height = "calc(2.5/12 * 100%)";
        email.style.height = "calc(1/2.5 * 100%)";
        password.style.height = "calc(1/2.5 * 100%)";
        containerSignInForget.style.display = "flex";

        if (is_row) {
            containerAccountPanRow.style.display = "flex";
        } else {
            containerAccountPanColumn.style.display = "flex";
        }
    } else {
        signInDisplay.style.display = "none";
        signUpDisplay.style.display = "flex";
        repeatPassword.style.display = "flex";
        containerSignInput.style.height = "calc(4/12 * 100%)";
        email.style.height = "calc(1/4 * 100%)";
        password.style.height = "calc(1/4 * 100%)";
        repeatPassword.style.height = "calc(1/4 * 100%)";
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

changeSize();
setSizeOfLeftAndRight();
setStatusProperties();

window.addEventListener("resize", function() {
    changeSize();
    setSizeOfLeftAndRight();
    setStatusProperties();
});
