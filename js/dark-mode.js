document.addEventListener("DOMContentLoaded", () => {
  const modeToggle = document.querySelector(".mode-tog");
  const darkMode = document.querySelector(".dark-mode");
  const htmlElement = document.documentElement;
  const toggleSound = document.getElementById("toggle-sound");
  const hoverSound = document.getElementById("hover-sound");

  // Check for saved theme preference or use preferred color scheme
  const savedTheme = localStorage.getItem("theme");
  const prefersDarkMode = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;

  // Apply saved theme or use system preference
  if (savedTheme) {
    htmlElement.setAttribute("data-bs-theme", savedTheme);
    if (savedTheme === "dark") {
      darkMode.classList.add("active");
      modeToggle.classList.add("active");
    }
  } else if (prefersDarkMode) {
    htmlElement.setAttribute("data-bs-theme", "dark");
    darkMode.classList.add("active");
    modeToggle.classList.add("active");
  }

  // Toggle theme when button is clicked
  modeToggle.addEventListener("click", () => {
    // Play the toggle sound
    if (toggleSound) {
      toggleSound.currentTime = 0;
      toggleSound.play().catch((e) => console.log("Audio play failed:", e));
    }

    const currentTheme = htmlElement.getAttribute("data-bs-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    // Toggle visual classes
    darkMode.classList.toggle("active");
    modeToggle.classList.toggle("active");

    // Apply theme after animation delay
    setTimeout(() => {
      htmlElement.setAttribute("data-bs-theme", newTheme);
      localStorage.setItem("theme", newTheme);
    }, 500); // Half of the animation duration
  });

  // Add hover sound functionality
  function addHoverSounds() {
    const hoverTriggers = document.querySelectorAll(".hover-sound-trigger");

    hoverTriggers.forEach((element) => {
      element.addEventListener("mouseenter", () => {
        if (hoverSound) {
          hoverSound.currentTime = 0;
          hoverSound
            .play()
            .catch((e) => console.log("Hover audio play failed:", e));
        }
      });
    });
  }

  // Initialize hover sounds
  addHoverSounds();
});
