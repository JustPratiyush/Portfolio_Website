document.addEventListener("DOMContentLoaded", () => {
  const carousel = document.getElementById("projectsCarousel");
  const progressThumb = document.getElementById("progressThumb");
  const progressTrack = document.querySelector(".carousel-progress-track");

  if (!carousel || !progressThumb || !progressTrack) return;

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

    // Update thumb position based on current scroll
    updateThumbPosition();
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

  // Mouse events for dragging
  progressThumb.addEventListener("mousedown", (e) => {
    isDragging = true;
    e.preventDefault();
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;

    const rect = progressTrack.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / trackWidth));
    const scrollAmount = percentage * maxScroll;

    setCarouselPosition(scrollAmount);
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
  });

  // Touch events for mobile
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
    const scrollAmount = percentage * maxScroll;

    setCarouselPosition(scrollAmount);
  });

  document.addEventListener("touchend", () => {
    isDragging = false;
  });

  // Click on track to jump to position
  progressTrack.addEventListener("click", (e) => {
    if (e.target === progressThumb) return;

    const rect = progressTrack.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / trackWidth));
    const scrollAmount = percentage * maxScroll;

    setCarouselPosition(scrollAmount);
  });

  // Initialize and handle resize
  updateDimensions();
  window.addEventListener("resize", updateDimensions);
});
