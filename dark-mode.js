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
