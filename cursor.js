document.addEventListener("DOMContentLoaded", () => {
  const customCursor = document.getElementById("custom-cursor");

  // Ensure the cursor element exists
  if (!customCursor) {
    console.error("Custom cursor element not found!");
    return;
  }

  // Update cursor position on mouse move
  document.addEventListener("mousemove", (e) => {
    // Use clientX and clientY for viewport-relative coordinates
    const x = e.clientX;
    const y = e.clientY;

    // Update the custom cursor's style
    // Using translate is often smoother than updating top/left directly
    customCursor.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
    // Or, if you prefer updating left/top:
    // customCursor.style.left = x + 'px';
    // customCursor.style.top = y + 'px';
  });

  // Add/Remove hover effect class based on hovered elements
  // Define selectors for elements that should trigger the hover effect
  const interactiveSelectors =
    'a, button, .MainButton, .skill-tag, input[type="submit"], [role="button"], .hover-effect'; // Add any other relevant selectors

  document.querySelectorAll(interactiveSelectors).forEach((el) => {
    el.addEventListener("mouseenter", () => {
      customCursor.classList.add("hover-effect");
    });
    el.addEventListener("mouseleave", () => {
      customCursor.classList.remove("hover-effect");
    });
  });

  // Optional: Hide custom cursor when mouse leaves the window
  document.addEventListener("mouseleave", () => {
    customCursor.style.opacity = "0"; // Hide it
  });

  document.addEventListener("mouseenter", () => {
    customCursor.style.opacity = "1"; // Show it again
  });

  // Optional: Add initial opacity style in CSS or here
  // This prevents seeing the cursor jump from 0,0 on load
  customCursor.style.opacity = "1"; // Make sure it's visible initially if not set in CSS
});

// Clicky Sound

const hoverSound = document.getElementById("hover-sound");

// Target all elements you want the sound to trigger on hover
const hoverTargets = document.querySelectorAll(".hover-sound-trigger");

hoverTargets.forEach((el) => {
  el.addEventListener("mouseenter", () => {
    hoverSound.currentTime = 0; // Rewind to start
    hoverSound.play();
  });
});
