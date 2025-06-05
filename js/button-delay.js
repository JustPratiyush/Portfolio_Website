// File: button-delay.js
// Handles the delayed appearance of the main hero buttons.

const buttonsContainer = document.querySelector(".ButtonsContainer");

if (buttonsContainer) {
  // Ensure buttons are hidden initially via JS (as a fallback to CSS)
  buttonsContainer.style.opacity = "0";
  buttonsContainer.style.visibility = "hidden";

  // Set a timeout to show the buttons after 6 seconds
  setTimeout(() => {
    buttonsContainer.style.opacity = "1";
    buttonsContainer.style.visibility = "visible";
  }, 6000);
}
