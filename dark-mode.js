document.addEventListener("DOMContentLoaded", () => {
  const darkModeToggle = document.getElementById("darkModeToggle");
  const htmlElement = document.documentElement;

  // Check for saved theme preference or use preferred color scheme
  const savedTheme = localStorage.getItem("theme");
  const prefersDarkMode = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;

  // Apply saved theme or use system preference
  if (savedTheme) {
    htmlElement.setAttribute("data-bs-theme", savedTheme);
  } else if (prefersDarkMode) {
    htmlElement.setAttribute("data-bs-theme", "dark");
  }

  // Toggle theme when button is clicked
  darkModeToggle.addEventListener("click", () => {
    const currentTheme = htmlElement.getAttribute("data-bs-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    htmlElement.setAttribute("data-bs-theme", newTheme);
    localStorage.setItem("theme", newTheme);

    // Animate the toggle button
    darkModeToggle.classList.add("clicked");
    setTimeout(() => {
      darkModeToggle.classList.remove("clicked");
    }, 300);
  });
});

// Add this to your existing dark-mode.js file or create a new skills.js file
document.addEventListener("DOMContentLoaded", () => {
  // Function to animate skills when they come into view
  function animateSkillsOnScroll() {
    const skillItems = document.querySelectorAll(".skill-item");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    skillItems.forEach((item) => {
      observer.observe(item);
    });
  }

  // Initialize animation
  animateSkillsOnScroll();
});
