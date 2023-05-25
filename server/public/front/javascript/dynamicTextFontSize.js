const defaultWindowHeight = 1011;

function multiplyTextSize() {

    // Get the height of the window
    let windowHeight = window.innerHeight;

    // Using querySelectorAll() to egt all objects
    let allObjects = document.querySelectorAll('*');

    // Calculate multiplication factor
    let multiplicationFactor = windowHeight/defaultWindowHeight; // Adjust the multiplication factor as needed

    // Apply new font size to all elements that need it
    for (let i = 0; i < allObjects.length; i++) {
        if (allObjects[i].hasAttribute("data-value")) {
            let currentFontSize = parseFloat(window.getComputedStyle(allObjects[i]).fontSize);
            let newFontSize = allObjects[i].dataset.value * multiplicationFactor;
            allObjects[i].style.fontSize = newFontSize + "px";
        }
    }
}

multiplyTextSize();
window.addEventListener("resize", function() {
    multiplyTextSize();
});