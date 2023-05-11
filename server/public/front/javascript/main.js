// Get the width and height of the window

let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;

const body = document.getElementById("body");

// Get the containerMain element
const containerMain = document.getElementById("container_main");

// Get the containerWelcomeLeft and containerWelcomeRight elements
const containerWelcomeLeft = document.getElementById("container_welcome_left");
const containerWelcomeRight = document.getElementById("container_welcome_right");

const containerNavigationRow = document.getElementById("container_navigation_row");
const containerNavigationColumn = document.getElementById("container_navigation_column");


// Get the welcomeLeft and welcomeRight elements
const welcomeLeft = document.getElementById("welcome_left");
const welcomeRight = document.getElementById("welcome_right");

const containerWelcomeText = document.getElementById("container_welcome_text");

const intermediateWelcomeText = document.getElementById("intermediate_welcome_text");


const welcomeTextPart = document.getElementById("welcome_text_part");


// Calculate the containerWelcomeLeft and containerWelcomeRight height
const containerWelcomeLeftHeight = window.innerHeight * 0.94 - 3;
const containerWelcomeRightHeight = window.innerHeight * 0.94 - 3;

// Calculate the welcomeLeft and welcomeRight height
const welcomeLeftHeight = windowHeight * 0.8;
const welcomeRightHeight = windowHeight * 0.8;

function changeSize() {
    // column
    if (window.innerWidth <= window.innerHeight * 1.4) {
        body.style.overflow = "auto"
        body.style.overflowX = "hidden"

        containerMain.style.flexDirection = "column";

        containerWelcomeLeft.style.width = "100%";
        containerWelcomeLeft.style.justifyContent="center";
        containerWelcomeLeft.style.alignItems="center";
        containerWelcomeLeft.style.marginTop = "3%";

        containerNavigationColumn.style.display = "flex";
        containerNavigationRow.style.display = "none";

        welcomeLeft.style.marginTop = "0%";
        welcomeLeft.style.marginRight = "0%";

        welcomeRight.style.width = "487px"


        containerWelcomeRight.style.width = "100%";
        containerWelcomeRight.style.justifyContent="center";
        containerWelcomeRight.style.alignItems="center";

        containerWelcomeText.style.justifyContent = "center";
        containerWelcomeText.style.alignItems = "center";

        intermediateWelcomeText.style.marginLeft = "0%";

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

        containerNavigationColumn.style.display = "none";
        containerNavigationRow.style.display = "flex";

        welcomeLeft.style.marginRight = "10%";

        welcomeRight.style.width = "450px"

        containerWelcomeRight.style.width = "50%";
        containerWelcomeRight.style.justifyContent="flex-start";
        containerWelcomeRight.style.alignItems="flex-start";

        containerWelcomeText.style.justifyContent = "flex-end";

        intermediateWelcomeText.style.marginLeft = "18%";

        welcomeTextPart.style.alignItems = "flex-start";
    }
}

changeSize();

console.log(welcomeLeftHeight);
console.log(welcomeRightHeight);

containerWelcomeLeft.style.height = containerWelcomeLeftHeight.toString() + "px";
containerWelcomeRight.style.height = containerWelcomeRightHeight.toString() + "px";

welcomeLeft.style.height = welcomeLeftHeight.toString() + "px";
welcomeRight.style.height = welcomeRightHeight.toString() + "px";

window.addEventListener("resize", function() {
    changeSize()
});