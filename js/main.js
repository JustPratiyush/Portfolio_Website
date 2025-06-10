/**
 * @file Main JavaScript file for the portfolio website.
 * @description Efficiently handles dark mode, animations, and interactions.
 */
(function () {
  "use strict";

  // -------------------------------------------------------------------
  // INITIALIZATION
  // -------------------------------------------------------------------

  function init() {
    initDarkMode();
    initTypingAnimation();
    initCarousels();
    initDelayedButtons();
    initClickHandlers();
    initHoverSounds();
    initImageOverlay();
    initScrollAnimations();
    initHoverEffects();
  }

  // Initialize scroll animations
  function initScrollAnimations() {
    const animateOnScroll = () => {
      // Only target elements in the blogs and projects sections
      const elements = document.querySelectorAll(
        ".blogs-grid .blog-card, .projects-grid .project-card, .section-header"
      );

      elements.forEach((element) => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (elementTop < windowHeight - 100) {
          element.style.opacity = "1";
          element.style.transform = "translateY(0)";
        }
      });
    };

    // Set initial styles only for blog and project cards in their respective sections
    document
      .querySelectorAll(".blogs-grid .blog-card, .projects-grid .project-card")
      .forEach((card) => {
        card.style.opacity = "0";
        card.style.transform = "translateY(30px)";
        card.style.transition =
          "opacity 0.6s ease-out, transform 0.6s ease-out";
      });

    document.querySelectorAll(".section-header").forEach((header) => {
      header.style.opacity = "0";
      header.style.transform = "translateY(-20px)";
      header.style.transition =
        "opacity 0.6s ease-out, transform 0.6s ease-out";
    });

    // Add scroll event listener with debounce for better performance
    let isScrolling;
    window.addEventListener(
      "scroll",
      () => {
        window.clearTimeout(isScrolling);
        isScrolling = setTimeout(animateOnScroll, 50);
      },
      { passive: true }
    );

    // Initial check in case elements are already in view
    animateOnScroll();
  }

  // Initialize hover effects
  function initHoverEffects() {
    const cards = document.querySelectorAll(".blog-card, .project-card");

    cards.forEach((card) => {
      const link = card.querySelector("a");
      const content = card.querySelector(
        ".blog-card-content, .project-card-content"
      );

      if (!link || !content) return;

      // Add hover effect for touch devices
      card.addEventListener("click", (e) => {
        if (e.target.tagName === "A" || e.target.closest("a")) return;
        link.click();
      });

      // Add keyboard navigation
      card.setAttribute("tabindex", "0");
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          link.click();
        }
      });
    });

    // Add hover effect for project card overlays
    const projectCards = document.querySelectorAll(".project-card");
    projectCards.forEach((card) => {
      const overlay = card.querySelector(".project-card-overlay");
      if (!overlay) return;

      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        overlay.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(67, 97, 238, 0.9), rgba(67, 97, 238, 0.7))`;
      });

      card.addEventListener("mouseleave", () => {
        overlay.style.background = "rgba(0, 0, 0, 0.7)";
      });
    });
  }

  // -------------------------------------------------------------------
  // DARK MODE
  // -------------------------------------------------------------------

  function initDarkMode() {
    const modeToggle = document.querySelector(".mode-tog");
    const darkModeOverlay = document.querySelector(".dark-mode");
    const htmlElement = document.documentElement;
    const toggleSound = document.getElementById("toggle-sound");

    if (!modeToggle) return;

    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      htmlElement.setAttribute("data-bs-theme", "dark");
      darkModeOverlay.classList.add("active");
      modeToggle.classList.add("active");
    }

    modeToggle.addEventListener("click", () => {
      if (toggleSound) {
        toggleSound.currentTime = 0;
        toggleSound.play().catch((e) => console.error("Audio play failed:", e));
      }
      const isDark = htmlElement.getAttribute("data-bs-theme") === "dark";
      const newTheme = isDark ? "light" : "dark";
      darkModeOverlay.classList.toggle("active");
      modeToggle.classList.toggle("active");
      setTimeout(() => {
        htmlElement.setAttribute("data-bs-theme", newTheme);
        localStorage.setItem("theme", newTheme);
      }, 500);
    });
  }

  // -------------------------------------------------------------------
  // TYPING ANIMATION
  // -------------------------------------------------------------------

  function initTypingAnimation() {
    const typingParagraphs = document.querySelectorAll("p.Typing");
    if (!typingParagraphs.length) return;

    const originalTexts = Array.from(typingParagraphs, (p) => {
      const text = p.textContent.trim();
      p.innerHTML =
        '<div class="typing-container"><span class="typed-text"></span><span class="typing-cursor" style="display: none;"></span></div>';
      return text;
    });

    typingParagraphs.forEach((p, i) => i > 0 && p.classList.add("waiting"));

    const animateParagraph = (index) => {
      if (index >= typingParagraphs.length) return;

      const p = typingParagraphs[index];
      p.classList.remove("waiting");

      const typedText = p.querySelector(".typed-text");
      const cursor = p.querySelector(".typing-cursor");
      const text = originalTexts[index];
      let charIndex = 0;

      cursor.style.display = "inline-block";

      function typeChar() {
        if (charIndex < text.length) {
          typedText.textContent += text.charAt(charIndex++);
          setTimeout(typeChar, 10);
        } else {
          cursor.style.display = "none";
          if (index < typingParagraphs.length - 1) {
            setTimeout(() => animateParagraph(index + 1), 1000);
          } else {
            // Show the buttons after the last paragraph finishes typing
            const buttonsContainer = document.querySelector('.ButtonsContainer');
            if (buttonsContainer) {
              buttonsContainer.classList.remove('hidden');
            }
          }
        }
      }
      typeChar();
    };
    animateParagraph(0);
  }

  // -------------------------------------------------------------------
  // UI INTERACTIONS
  // -------------------------------------------------------------------

  function initDelayedButtons() {
    const buttonsContainer = document.querySelector(".ButtonsContainer");
    setTimeout(() => buttonsContainer?.classList.add("visible"), 6000);
  }

  function initClickHandlers() {
    // Directly attach click handlers to ensure they work
    const viewAllBlogsBtn = document.getElementById('viewAllBlogsBtn');
    if (viewAllBlogsBtn) {
      viewAllBlogsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'blogs/';
      });
    }

    const clickActions = {
      contactBtn: () => {
        window.location.href = "mailto:pratiyushkuchhal@gmail.com";
      },
      projectsScrollBtn: () => {
        const projects = document.getElementById("projects");
        if (projects) {
          projects.scrollIntoView({ behavior: "smooth" });
        }
      },
      viewAllProjectsBtn: () => {
        window.location.href = "projects/";
      },
    };

    // Add click handlers for the view all buttons
    for (const id in clickActions) {
      const element = document.getElementById(id);
      if (element) {
        element.addEventListener("click", (e) => {
          e.preventDefault();
          clickActions[id]();
        });
      }
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      if (anchor.getAttribute("href") !== "#") {
        anchor.addEventListener("click", function (e) {
          e.preventDefault();
          const target = document.querySelector(this.getAttribute("href"));
          if (target) {
            target.scrollIntoView({
              behavior: "smooth",
            });
          }
        });
      }
    });
  }

  function initHoverSounds() {
    const hoverSound = document.getElementById("hover-sound");
    if (!hoverSound) return;
    document.querySelectorAll(".hover-sound-trigger").forEach((el) => {
      el.addEventListener("mouseenter", () => {
        hoverSound.currentTime = 0;
        hoverSound
          .play()
          .catch((e) => console.error("Hover audio play failed:", e));
      });
    });
  }

  function initImageOverlay() {
    document
      .querySelector(".image-container")
      ?.addEventListener("click", function (e) {
        e.preventDefault();
        this.classList.toggle("overlay-active");
      });
  }

  // Execute initialization when the DOM is ready
  document.addEventListener("DOMContentLoaded", init);
})();
