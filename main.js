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
          }
        }
      }
      typeChar();
    };
    animateParagraph(0);
  }

  // -------------------------------------------------------------------
  // CAROUSEL CONTROL
  // -------------------------------------------------------------------

  function initCarousels() {
    const setupCarousel = (carouselId, thumbId) => {
      const carousel = document.getElementById(carouselId);
      const thumb = document.getElementById(thumbId);
      if (!carousel || !thumb) return;

      const track = thumb.parentElement;
      let isDragging = false;
      let maxScroll = 0,
        trackWidth = 0,
        thumbWidth = 0;

      const updateDimensions = () => {
        maxScroll = carousel.scrollWidth - carousel.parentElement.offsetWidth;
        trackWidth = track.offsetWidth;
        thumbWidth = thumb.offsetWidth;
        updateThumbPosition();
      };

      const getCurrentScroll = () =>
        parseFloat(
          carousel.style.transform.match(
            /translateX\(-?(\d*\.?\d*)px\)/
          )?.[1] || 0
        );
      const setCarouselPosition = (scrollAmount) => {
        carousel.style.transform = `translateX(-${Math.max(
          0,
          Math.min(scrollAmount, maxScroll)
        )}px)`;
        updateThumbPosition();
      };
      const updateThumbPosition = () => {
        const maxThumbPos = trackWidth - thumbWidth;
        thumb.style.left =
          maxScroll > 0
            ? `${Math.min(
                (getCurrentScroll() / maxScroll) * maxThumbPos,
                maxThumbPos
              )}px`
            : "0px";
      };
      const handleDrag = (clientX) => {
        const rect = track.getBoundingClientRect();
        const percentage = Math.max(
          0,
          Math.min(1, (clientX - rect.left) / trackWidth)
        );
        setCarouselPosition(percentage * maxScroll);
      };

      const onPointerMove = (e) => isDragging && handleDrag(e.clientX);
      const onPointerUp = () => (isDragging = false);

      thumb.addEventListener("pointerdown", (e) => {
        isDragging = true;
        thumb.setPointerCapture(e.pointerId);
        e.preventDefault();
      });
      document.addEventListener("pointermove", onPointerMove);
      document.addEventListener("pointerup", onPointerUp);
      thumb.addEventListener("lostpointercapture", onPointerUp);
      track.addEventListener(
        "click",
        (e) => e.target !== thumb && handleDrag(e.clientX)
      );

      updateDimensions();
      window.addEventListener("resize", updateDimensions, { passive: true });
    };

    setupCarousel("projectsCarousel", "progressThumb");
    setupCarousel("blogsCarousel", "blogProgressThumb");
  }

  // -------------------------------------------------------------------
  // UI INTERACTIONS
  // -------------------------------------------------------------------

  function initDelayedButtons() {
    const buttonsContainer = document.querySelector(".ButtonsContainer");
    setTimeout(() => buttonsContainer?.classList.add("visible"), 6000);
  }

  function initClickHandlers() {
    const clickActions = {
      contactBtn: () =>
        (window.location.href = "mailto:pratiyushkuchhal@gmail.com"),
      projectsScrollBtn: () =>
        document
          .getElementById("projects")
          ?.scrollIntoView({ behavior: "smooth" }),
      viewAllBlogsBtn: () => (window.location.href = "blog/"),
      viewAllProjectsBtn: () => (window.location.href = "blog/"), // Note: As per original, change to 'projects/' if needed
    };
    for (const id in clickActions) {
      document.getElementById(id)?.addEventListener("click", clickActions[id]);
    }
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
