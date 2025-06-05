document.addEventListener("DOMContentLoaded", () => {
  // Function to initialize a carousel
  const initCarousel = (carouselId, thumbId) => {
    const carousel = document.getElementById(carouselId);
    const progressThumb = document.getElementById(thumbId);

    if (!carousel || !progressThumb) {
      // If elements don't exist, do nothing
      return;
    }

    const progressTrack = progressThumb.parentElement;
    if (!progressTrack) return;

    let isDragging = false;
    let maxScroll = 0;
    let trackWidth = 0;
    let thumbWidth = 0;

    function updateDimensions() {
      const containerWidth = carousel.parentElement.offsetWidth;
      const contentWidth = carousel.scrollWidth;
      maxScroll = Math.max(0, contentWidth - containerWidth);
      trackWidth = progressTrack.offsetWidth;
      thumbWidth = progressThumb.offsetWidth;
      updateThumbPosition(); // Recalculate thumb position on resize
    }

    function updateThumbPosition() {
      if (maxScroll === 0) {
        progressThumb.style.left = "0px";
        return;
      }
      const scrollPercentage = getCurrentScroll() / maxScroll;
      const maxThumbPosition = trackWidth - thumbWidth;
      const thumbPosition = scrollPercentage * maxThumbPosition;
      progressThumb.style.left = `${Math.max(
        0,
        Math.min(thumbPosition, maxThumbPosition)
      )}px`;
    }

    function getCurrentScroll() {
      const transform = carousel.style.transform;
      if (transform && transform.includes("translateX")) {
        const match = transform.match(/translateX\((-?\d+(?:\.\d+)?)px\)/);
        return match ? Math.abs(parseFloat(match[1])) : 0;
      }
      return 0;
    }

    function setCarouselPosition(scrollAmount) {
      const clampedScroll = Math.max(0, Math.min(scrollAmount, maxScroll));
      carousel.style.transform = `translateX(-${clampedScroll}px)`;
      updateThumbPosition();
    }

    // --- Event Listeners ---

    // Mouse events
    progressThumb.addEventListener("mousedown", (e) => {
      isDragging = true;
      e.preventDefault();
    });

    document.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      const rect = progressTrack.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, x / trackWidth));
      setCarouselPosition(percentage * maxScroll);
    });

    document.addEventListener("mouseup", () => {
      isDragging = false;
    });

    // Touch events
    progressThumb.addEventListener("touchstart", (e) => {
      isDragging = true;
      e.preventDefault();
    });

    document.addEventListener("touchmove", (e) => {
      if (!isDragging) return;
      const touch = e.touches[0];
      const rect = progressTrack.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, x / trackWidth));
      setCarouselPosition(percentage * maxScroll);
    });

    document.addEventListener("touchend", () => {
      isDragging = false;
    });

    // Click on track
    progressTrack.addEventListener("click", (e) => {
      if (e.target === progressThumb) return;
      const rect = progressTrack.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, x / trackWidth));
      setCarouselPosition(percentage * maxScroll);
    });

    // Initial setup and resize handling
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
  };

  // Initialize both carousels
  initCarousel("projectsCarousel", "progressThumb");
  initCarousel("blogsCarousel", "blogProgressThumb");
});
