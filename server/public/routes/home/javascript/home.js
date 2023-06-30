// Get the elements
const body = document.getElementById("body");
const topEmptySpace = document.getElementById("top_empty_space");

// Get left side elements
const homeLeft = document.getElementById("home_left");
const delichatButton = document.getElementById("delichat_button");

// Get right side elements
const homeRight = document.getElementById("home_right");

// Constant variables
const homeHeightDefault = 14;
const homeLeftWidthDefault = 9.2;
const homeRightWidthDefault = 11;
const homeLeftProportion = homeLeftWidthDefault / homeHeightDefault;
const homeRightProportion = homeRightWidthDefault / homeHeightDefault;

// Function to set size of homeLeft and homeRight
function setSizeOfLeftAndRight() {

    let homeLeftHeight = window.innerHeight * (14 / 18);
    let homeRightHeight = window.innerHeight * (14 / 18);

    let homeLeftWidth = homeLeftHeight * homeLeftProportion;
    let homeRightWidth = homeRightHeight * homeRightProportion;

    homeLeft.style.width = `${homeLeftWidth}px`;
    homeLeft.style.height = `${homeLeftHeight}px`;

    homeRight.style.width = `${homeRightWidth}px`;
    homeRight.style.height = `${homeRightHeight}px`;
}

// Function to handle resizing
function changeSize() {
    if (window.innerWidth > window.innerHeight * 1.5) {
        topEmptySpace.scrollIntoView({ behavior: "auto" });
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