// Get the elements
const body = document.getElementById("body");
const topEmptySpace = document.getElementById("top_empty_space");

// Get left side elements
const aboutLeft = document.getElementById("about_left");
// Get right side elements
const aboutRight = document.getElementById("about_right");

// Constant variables
const aboutHeightDefault = 15;
const aboutLeftWidthDefault = 11.2;
const aboutRightWidthDefault = 10;
const aboutLeftProportion = aboutLeftWidthDefault / aboutHeightDefault;
const aboutRightProportion = aboutRightWidthDefault / aboutHeightDefault;

// Function to set size of aboutLeft and aboutRight
function setSizeOfLeftAndRight() {

    const aboutLeftHeight = window.innerHeight * (15 / 18);
    const aboutRightHeight = window.innerHeight * (15 / 18);

    const aboutLeftWidth = aboutLeftHeight * aboutLeftProportion;
    const aboutRightWidth = aboutRightHeight * aboutRightProportion;

    aboutLeft.style.width = `${aboutLeftWidth}px`;
    aboutLeft.style.height = `${aboutLeftHeight}px`;

    aboutRight.style.width = `${aboutRightWidth}px`;
    aboutRight.style.height = `${aboutRightHeight}px`;
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

// Initial setup
setSizeOfLeftAndRight();
changeSize();
