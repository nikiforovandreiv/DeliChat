// Get the elements
const body = document.getElementById("body");
const topEmptySpace = document.getElementById("top_empty_space");
const containerMain = document.getElementById("container_main");

// Get left side elements
const containerWelcomeLeft = document.getElementById("container_welcome_left");
const welcomeLeft = document.getElementById("welcome_left");
const welcomeLogo = document.getElementById("welcome_logo");
const containerWelcomeText = document.getElementById("container_welcome_text");
const intermediateWelcomeText = document.getElementById("intermediate_welcome_text");
const welcomeTextParagraph = document.getElementsByClassName("welcome_text_paragraph");
const containerDelichatButton = document.getElementById("container_delichat_button");
const intermediateDelichatButton = document.getElementById("intermediate_delichat_button");
const delichatButton = document.getElementById("delichat_button");

// Get right side elements
const containerWelcomeRight = document.getElementById("container_welcome_right");
const welcomeRight = document.getElementById("welcome_right");

// Get navigation elements
const containerNavigationRow = document.getElementById("container_navigation_row");
const containerNavigationColumn = document.getElementById("container_navigation_column");

// Constant variables
const welcomeHeightDefault = 14;
const welcomeLeftWidthDefault = 9.2;
const welcomeRightWidthDefault = 11;
const welcomeLeftProportion = welcomeLeftWidthDefault / welcomeHeightDefault;
const welcomeRightProportion = welcomeRightWidthDefault / welcomeHeightDefault;

// Function to set size of welcomeLeft and welcomeRight
function setSizeOfLeftAndRight() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const welcomeLeftHeight = windowHeight * (14 / 18);
    const welcomeRightHeight = windowHeight * (14 / 18);

    const welcomeLeftWidth = welcomeLeftHeight * welcomeLeftProportion;
    const welcomeRightWidth = welcomeRightHeight * welcomeRightProportion;

    welcomeLeft.style.width = `${welcomeLeftWidth}px`;
    welcomeLeft.style.height = `${welcomeLeftHeight}px`;

    welcomeRight.style.width = `${welcomeRightWidth}px`;
    welcomeRight.style.height = `${welcomeRightHeight}px`;
}

// Function to handle resizing
function changeSize() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    if (windowWidth <= windowHeight * 1.5) {
        // Change main elements
        body.style.overflow = "auto";
        body.style.overflowX = "hidden";
        containerNavigationColumn.style.display = "flex";
        containerNavigationRow.style.display = "none";
        containerMain.style.flexDirection = "column";

        // Change left side elements
        containerWelcomeLeft.style.width = "100%";
        containerWelcomeLeft.style.alignItems = "center";
        welcomeLeft.style.marginRight = "0";
        welcomeLogo.style.justifyContent = "center";
        intermediateWelcomeText.style.width = "calc(9.2/9.2 * 100%)";
        for (let i = 0; i < welcomeTextParagraph.length; i++) {
            welcomeTextParagraph[i].style.textAlign = "center";
        }
        containerDelichatButton.style.justifyContent = "center";
        intermediateDelichatButton.style.marginLeft = "0";

        // Change right side elements
        containerWelcomeRight.style.width = "100%";
        containerWelcomeRight.style.alignItems = "center";
    } else {
        // Change main elements
        body.style.overflow = "hidden";
        containerNavigationColumn.style.display = "none";
        containerNavigationRow.style.display = "flex";
        containerMain.style.flexDirection = "row";
        topEmptySpace.scrollIntoView({ behavior: "auto" });

        // Change left side elements
        containerWelcomeLeft.style.width = "50%";
        containerWelcomeLeft.style.alignItems = "flex-end";
        welcomeLeft.style.marginRight = "calc(2/16 * 100%)";
        welcomeLogo.style.justifyContent = "flex-start";
        for (let i = 0; i < welcomeTextParagraph.length; i++) {
            welcomeTextParagraph[i].style.textAlign = "start";
        }
        intermediateWelcomeText.style.width = "calc(8.7/9.2 * 100%)";
        containerDelichatButton.style.justifyContent = "flex-start";
        intermediateDelichatButton.style.marginLeft = "15%";

        // Change right side elements
        containerWelcomeRight.style.width = "50%";
        containerWelcomeRight.style.alignItems = "flex-start";
    }
}

// Event listeners
window.addEventListener("resize", function () {
    setSizeOfLeftAndRight();
    changeSize();
});

delichatButton.addEventListener("click", function () {
    window.location.href = "/chat";
});

// Initial setup
setSizeOfLeftAndRight();
changeSize();
