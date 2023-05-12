// Get the width and height of the window
let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;

// constant variables to calculate the ratio of width and height
const welcomeHeightDefault = 689;
const welcomeLeftWidthDefault = 472;
const welcomeRightWidthDefault = 545;

const grid = 14;

// calculation of constant ration of width and height
const welcomeLeftProportion = welcomeLeftWidthDefault / welcomeHeightDefault;
const welcomeRightProportion = welcomeRightWidthDefault / welcomeHeightDefault;

// Get the body element
const body = document.getElementById("body");

// Get the containerMain element
const containerMain = document.getElementById("container_main");

// Get the containerWelcomeLeft and containerWelcomeRight elements
const containerWelcomeLeft = document.getElementById("container_welcome_left");
const containerWelcomeRight = document.getElementById("container_welcome_right");

// Get the welcomeLeft and welcomeRight elements
const welcomeLeft = document.getElementById("welcome_left");
const welcomeRight = document.getElementById("welcome_right");

// Get the containerWelcomeLogo and intermediateWelcomeLogo elements
const containerWelcomeLogo = document.getElementById("container_welcome_logo");
const intermediateWelcomeLogo = document.getElementById("intermediate_welcome_logo");

// Get the containerWelcomeText and sub elements
const containerWelcomeText = document.getElementById("container_welcome_text");
const intermediateWelcomeText = document.getElementById("intermediate_welcome_text");
const welcomeTextPart = document.getElementById("welcome_text_part");
const welcomeTextParagraph = document.getElementsByClassName("welcome_text_paragraph");

// Get the containerDeliChatButton element
const containerDeliChatButton = document.getElementById("container_delichat_button");

// Get the containerNavigationRow and containerNavigationColumn elements
const containerNavigationRow = document.getElementById("container_navigation_row");
const containerNavigationColumn = document.getElementById("container_navigation_column");

// Get the containerWelcomeSoup element
const containerWelcomeSoup = document.getElementById("container_welcome_soup");

// Calculate the containerWelcomeLeft and containerWelcomeRight height
const containerWelcomeLeftHeight = window.innerHeight * 0.94;
const containerWelcomeRightHeight = window.innerHeight * 0.94;

// Calculate the welcomeLeft and welcomeRight height
const welcomeLeftHeight = windowHeight * 0.8;
const welcomeRightHeight = windowHeight * 0.8;

// Calculate the welcomeLeft and welcomeRight width
const welcomeLeftWidth = welcomeLeftHeight * welcomeLeftProportion;
const welcomeRightWidth = welcomeRightHeight * welcomeRightProportion;

function setSizeOfLeftAndRight() {
    containerWelcomeLeft.style.height = containerWelcomeLeftHeight.toString() + "px";
    containerWelcomeRight.style.height = containerWelcomeRightHeight.toString() + "px";

    welcomeLeft.style.height = welcomeLeftHeight.toString() + "px";
    welcomeRight.style.height = welcomeRightHeight.toString() + "px";

    welcomeLeft.style.width = welcomeLeftWidth.toString() + "px";
    welcomeRight.style.width = welcomeRightWidth.toString() + "px";

    containerWelcomeLogo.style.height = (6/grid * 100).toString() + "%";
    intermediateWelcomeLogo.style.width = (5/6 * 100).toString() + "%";
    intermediateWelcomeLogo.style.height = (5/6 * 100).toString() + "%";

    containerWelcomeText.style.height = (6/grid * 100).toString() + "%";
    intermediateWelcomeText.style.width = (8/9 * 100).toString() + "%";
    welcomeTextPart.style.height = (6/7 * 100).toString() + "%";

    containerDeliChatButton.style.height = (2/grid * 100).toString() + "%";

    containerNavigationRow.style.height = (3/grid * 100).toString() + "%";

    containerWelcomeSoup.style.height = (11/grid * 100).toString() + "%";
}

function changeSize() {
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;

    // column
    if (window.innerWidth <= window.innerHeight * 1.4) {
        body.style.overflow = "auto"
        body.style.overflowX = "hidden"

        containerMain.style.flexDirection = "column";

        containerWelcomeLeft.style.width = "100%";
        containerWelcomeLeft.style.justifyContent="center";
        containerWelcomeLeft.style.alignItems="center";
        containerWelcomeLeft.style.marginTop = "3%";

        containerWelcomeLogo.style.justifyContent = "center";

        for (let i = 0; i < welcomeTextParagraph.length; i++) {
            welcomeTextParagraph[i].style.textAlign = "center";
        }

        containerDeliChatButton.style.justifyContent = "center";

        containerNavigationColumn.style.display = "flex";
        containerNavigationRow.style.display = "none";

        welcomeLeft.style.marginTop = "0%";
        welcomeLeft.style.marginRight = "0%";

        containerWelcomeRight.style.width = "100%";
        containerWelcomeRight.style.justifyContent="center";
        containerWelcomeRight.style.alignItems="center";

        welcomeTextPart.style.justifyContent = "center";
        welcomeTextPart.style.alignItems = "center";
    }
    // row
    else {
        body.style.overflow = "hidden"

        containerMain.style.flexDirection = "row";

        containerWelcomeLeft.style.width = "50%";
        containerWelcomeLeft.style.justifyContent="flex-start";
        containerWelcomeLeft.style.alignItems="flex-end";
        containerWelcomeLeft.style.marginTop = "0%";

        containerWelcomeLogo.style.justifyContent = "flex-start";

        for (let i = 0; i < welcomeTextParagraph.length; i++) {
            welcomeTextParagraph[i].style.textAlign = "start";
        }

        containerDeliChatButton.style.justifyContent = "flex-start";

        containerNavigationColumn.style.display = "none";
        containerNavigationRow.style.display = "flex";

        welcomeLeft.style.marginRight = "10%";

        containerWelcomeRight.style.width = "50%";
        containerWelcomeRight.style.justifyContent="flex-start";
        containerWelcomeRight.style.alignItems="flex-start";

        welcomeTextPart.style.alignItems = "flex-start";
    }
}

changeSize();
setSizeOfLeftAndRight();

window.addEventListener("resize", function() {
    changeSize();
    setSizeOfLeftAndRight();
});
