document.addEventListener("DOMContentLoaded", () => {
  const typingParagraphs = document.querySelectorAll("p.Typing");

  if (typingParagraphs.length > 0) {
    const originalTexts = [];

    // Prepare paragraph elements for animation
    typingParagraphs.forEach((paragraph, index) => {
      originalTexts.push(paragraph.textContent.trim());

      const container = document.createElement("div");
      container.className = "typing-container";

      const typedText = document.createElement("span");
      typedText.className = "typed-text";

      const cursor = document.createElement("span");
      cursor.className = "typing-cursor";
      cursor.style.display = "none"; // Hide cursors initially

      container.appendChild(typedText);
      container.appendChild(cursor);

      paragraph.textContent = "";
      paragraph.appendChild(container);

      if (index > 0) {
        paragraph.classList.add("waiting");
      }
    });

    function animateParagraph(paragraphIndex) {
      if (paragraphIndex >= typingParagraphs.length) {
        return; // All paragraphs are done
      }

      const paragraph = typingParagraphs[paragraphIndex];
      paragraph.classList.remove("waiting");

      const typedText = paragraph.querySelector(".typed-text");
      const cursor = paragraph.querySelector(".typing-cursor");
      cursor.style.display = "inline-block";

      const originalText = originalTexts[paragraphIndex];
      let charIndex = 0;
      const typingSpeed = 10; // milliseconds per character

      function typeNextCharacter() {
        if (charIndex < originalText.length) {
          typedText.textContent += originalText.charAt(charIndex);
          charIndex++;
          setTimeout(typeNextCharacter, typingSpeed);
        } else {
          // Paragraph complete
          if (paragraphIndex < typingParagraphs.length - 1) {
            // Pause before starting the next paragraph
            setTimeout(() => {
              cursor.style.display = "none";
              animateParagraph(paragraphIndex + 1);
            }, 1000); // 1 second pause before next paragraph
          } else {
            cursor.style.display = "none"; // Hide cursor after the last paragraph
          }
        }
      }

      // Start typing for this paragraph (delay set to 0 from your input)
      setTimeout(typeNextCharacter, 0);
    }

    // Start animation with the first paragraph immediately after setup
    animateParagraph(0);
  }
});
