document.addEventListener("DOMContentLoaded", () => {
  // Check if device is touch-capable
  const isTouchDevice = () => {
    return (
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0
    );
  };

  const customCursor = document.getElementById("custom-cursor");
  const hoverSound = document.getElementById("hover-sound");

  // If it's a touch device, hide the custom cursor but keep sound functionality
  if (isTouchDevice()) {
    document.body.classList.add("touch-device");
    if (customCursor) {
      customCursor.style.display = "none";
    }
    // Note: We don't return early here so sound functionality can still work
  }

  // Only set up cursor movement if it exists and we're not on a touch device
  if (customCursor && !isTouchDevice()) {
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
      customCursor.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
    });

    // Add/Remove hover effect class based on hovered elements
    const interactiveSelectors =
      'a, button, .MainButton, .skill-tag, input[type="submit"], [role="button"], .hover-effect';

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
    customCursor.style.opacity = "1"; // Make sure it's visible initially if not set in CSS
  }

  // Clicky Sound - Handle this separately from cursor functionality
  // This ensures sounds work even on touch devices
  const hoverTargets = document.querySelectorAll(".hover-sound-trigger");

  hoverTargets.forEach((el) => {
    // Use touchstart event for touch devices and mouseenter for mouse devices
    const eventType = isTouchDevice() ? "touchstart" : "mouseenter";

    el.addEventListener(eventType, () => {
      if (hoverSound) {
        hoverSound.currentTime = 0; // Rewind to start

        // Play the sound with a user interaction promise handler
        const playPromise = hoverSound.play();

        // Handle potential promise rejection (happens in some browsers)
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.log("Audio play failed:", error);
          });
        }
      }
    });
  });

  // Reading list image container two-step click functionality
  const imageContainer = document.querySelector(".image-container");
  if (imageContainer) {
    let tooltipVisible = false;

    imageContainer.addEventListener("click", (event) => {
      // For touch devices, implement two-step click
      if (isTouchDevice()) {
        // If tooltip is not visible yet, show it and prevent navigation
        if (!tooltipVisible) {
          const tooltip = imageContainer.querySelector(".image-tooltip");
          tooltip.style.visibility = "visible";
          tooltip.style.opacity = "1";

          // Add overlay effect
          imageContainer.classList.add("overlay-active");

          tooltipVisible = true;
          event.preventDefault();

          // Play hover sound if available
          if (hoverSound) {
            hoverSound.currentTime = 0;
            hoverSound
              .play()
              .catch((error) => console.log("Audio play failed:", error));
          }
        } else {
          // Second click, navigate to URL
          window.open(
            "https://kuchhal.notion.site/476175bbef7e47c4ac38ddf6935ec3af?v=83043f2ba1ee4f27bf4c3e6667a72d62",
            "_blank"
          );

          // Reset state
          setTimeout(() => {
            const tooltip = imageContainer.querySelector(".image-tooltip");
            tooltip.style.visibility = "";
            tooltip.style.opacity = "";
            imageContainer.classList.remove("overlay-active");
            tooltipVisible = false;
          }, 300);
        }
      } else {
        // For non-touch devices, navigate on first click
        window.open(
          "https://kuchhal.notion.site/476175bbef7e47c4ac38ddf6935ec3af?v=83043f2ba1ee4f27bf4c3e6667a72d62",
          "_blank"
        );
      }
    });

    // For touch devices, add special handling to disable hover effects
    if (isTouchDevice()) {
      // Add a style to prevent hover effects on touch devices
      const style = document.createElement("style");
      style.textContent = `
          .image-container:hover .image-tooltip {
            visibility: hidden;
            opacity: 0;
          }
          .image-container:hover::after {
            opacity: 0;
          }
          .image-container.overlay-active::after {
            opacity: 1 !important;
          }
        `;
      document.head.appendChild(style);
    }
  }
});
