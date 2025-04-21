// File: button-delay.js
// Handles the delayed appearance of the main hero buttons.

const buttonsContainer = document.querySelector(".ButtonsContainer");

if (buttonsContainer) {
  // Ensure buttons are hidden initially via JS (as a fallback to CSS).
  // The primary hiding should still be done via CSS for immediate effect on load.
  buttonsContainer.style.opacity = "0";
  buttonsContainer.style.visibility = "hidden";

  // Set a timeout to show the buttons after 3 seconds
  setTimeout(() => {
    buttonsContainer.style.opacity = "1";
    buttonsContainer.style.visibility = "visible";
    console.log("Buttons (delayed) are now visible."); // Log specific to this action
  }, 5000); // 3000 milliseconds = 3 seconds
} else {
  // Log an error specifically if the button container isn't found
  console.error(
    "Element with class .ButtonsContainer (for button delay) not found!"
  );
}
