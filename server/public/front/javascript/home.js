// Get the width and height of the window
let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;

// constant variables to calculate the ratio of width and height
const welcomeHeightDefault = 14;
const welcomeLeftWidthDefault = 9.2;
const welcomeRightWidthDefault = 11;

// calculation of constant ratio of width and height
const welcomeLeftProportion = welcomeLeftWidthDefault / welcomeHeightDefault;
const welcomeRightProportion = welcomeRightWidthDefault / welcomeHeightDefault;

// Get the body element
const body = document.getElementById("body");

// Get the topEmptySpace element
const topEmptySpace = document.getElementById("top_empty_space");

// Get the containerMain element
const containerMain = document.getElementById("container_main");

// Get the containerWelcomeLeft and containerWelcomeRight elements
const containerWelcomeLeft = document.getElementById("container_welcome_left");
const containerWelcomeRight = document.getElementById("container_welcome_right");

// Get the welcomeLeft and welcomeRight elements
const welcomeLeft = document.getElementById("welcome_left");
const welcomeRight = document.getElementById("welcome_right");

// Get the welcomeLogo element
const welcomeLogo = document.getElementById("welcome_logo");

// Get the containerWelcomeText and sub elements
const containerWelcomeText = document.getElementById("container_welcome_text");
const intermediateWelcomeText = document.getElementById("intermediate_welcome_text");
const welcomeTextParagraph = document.getElementsByClassName("welcome_text_paragraph");

// Get the containerNavigationRow and containerNavigationColumn elements
const containerNavigationRow = document.getElementById("container_navigation_row");
const containerNavigationColumn = document.getElementById("container_navigation_column");


function setSizeOfLeftAndRight() {
    // Update the width and height of the window
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;

    // Calculate the welcomeLeft and welcomeRight height
    let welcomeLeftHeight = windowHeight * (14/18);
    let welcomeRightHeight = windowHeight * (14/18);

    // Calculate the welcomeLeft and welcomeRight width
    let welcomeLeftWidth = welcomeLeftHeight * welcomeLeftProportion;
    let welcomeRightWidth = welcomeRightHeight * welcomeRightProportion;


    // Set the welcomeLeft width and height
    welcomeLeft.style.width = welcomeLeftWidth.toString() + "px";
    welcomeLeft.style.height = welcomeLeftHeight.toString() + "px";

    // Set the welcomeRight width and height
    welcomeRight.style.width = welcomeRightWidth.toString() + "px";
    welcomeRight.style.height = welcomeRightHeight.toString() + "px";
}

function changeSize() {
    // Update the width and height of the window
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;

    // column
    if (window.innerWidth <= window.innerHeight * 1.4) {
        body.style.overflow = "auto"
        body.style.overflowX = "hidden"

        containerMain.style.flexDirection = "column";

        containerWelcomeLeft.style.width = "100%";
        containerWelcomeLeft.style.alignItems = "center";
        welcomeLeft.style.marginRight = "0";

        welcomeLogo.style.justifyContent = "center";
        for (let i = 0; i < welcomeTextParagraph.length; i++) {
            welcomeTextParagraph[i].style.textAlign = "center";
        }

        containerWelcomeText.style.justifyContent = "center";
        intermediateWelcomeText.style.width = "calc(9.2/9.2 * 100%)";

        containerNavigationColumn.style.display = "flex";
        containerNavigationRow.style.display = "none";

        containerWelcomeRight.style.width = "100%";
        containerWelcomeRight.style.alignItems = "center";
    }
    // row
    else {
        body.style.overflow = "hidden"

        containerMain.style.flexDirection = "row";

        containerWelcomeLeft.style.width = "50%";
        containerWelcomeLeft.style.alignItems = "flex-end";
        welcomeLeft.style.marginRight = "calc(2/16 * 100%)";

        welcomeLogo.style.justifyContent = "flex-start";
        for (let i = 0; i < welcomeTextParagraph.length; i++) {
            welcomeTextParagraph[i].style.textAlign = "start";
        }

        containerWelcomeText.style.justifyContent = "flex-end";
        intermediateWelcomeText.style.width = "calc(8.6/9.2 * 100%)";

        containerNavigationColumn.style.display = "none";
        containerNavigationRow.style.display = "flex";

        containerWelcomeRight.style.width = "50%";
        containerWelcomeRight.style.alignItems = "flex-start";

        topEmptySpace.scrollIntoView({ behavior: "auto" });
    }
}

setSizeOfLeftAndRight();
changeSize();

window.addEventListener("resize", function() {
    setSizeOfLeftAndRight();
    changeSize();
});
