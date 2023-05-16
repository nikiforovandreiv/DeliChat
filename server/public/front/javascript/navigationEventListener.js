// Get the navigation buttons elements
const navigationButtons = document.getElementsByClassName("navigation_button");

// Set the href of the navigation buttons elements
for (let i = 0; i < navigationButtons.length; i++) {
    let navigationButton = navigationButtons[i]
    let buttonContent = navigationButton.textContent.replace(/\s+/g, '');

    navigationButton.addEventListener('click', function() {
        if (buttonContent === "Home") {
            window.location.href = "/";
        } else if (buttonContent === "About") {
            window.location.href = "/";
        } else if (buttonContent === "Account") {
            window.location.href = "/account";
        }
    });
}