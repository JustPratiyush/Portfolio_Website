// Main page blog loader - Displays latest 3 blog posts
class MainBlogLoader {
  constructor() {
    this.blogContainer = null;
    this.init();
  }

  async init() {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.loadBlogs());
    } else {
      this.loadBlogs();
    }
  }

  async loadBlogs() {
    try {
      this.blogContainer = document.querySelector(".blogs-grid");

      if (!this.blogContainer) {
        console.error("Blog container not found");
        return;
      }

      // Show loading state
      this.blogContainer.innerHTML = '<div class="col-12 text-center"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div></div>';

      // Fetch blog data from JSON file
      const response = await fetch("blogs/blogData.json");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blogPosts = await response.json();
      // Get only the first 3 posts (latest)
      const latestPosts = blogPosts.slice(0, 3);
      this.renderBlogs(latestPosts);
    } catch (error) {
      console.error("Error loading blog posts:", error);
      this.showError();
    }
  }

  renderBlogs(blogPosts) {
    // Clear existing content
    this.blogContainer.innerHTML = "";

    blogPosts.forEach((post) => {
      const blogCard = this.createBlogCard(post);
      this.blogContainer.appendChild(blogCard);
    });
  }

  createBlogCard(post) {
    const blogCard = document.createElement("div");
    blogCard.className = "cardsize col hover-sound-trigger";

    const tagsHTML = post.tags
      .map((tag, index) => {
        // Use different badge colors based on position for better visual appeal
        const badgeClasses = [
          "bg-primary",
          "bg-success",
          "bg-info",
          "bg-warning",
          "bg-danger",
          "bg-purple",
          "bg-dark"
        ];
        const badgeClass = badgeClasses[index % badgeClasses.length];
        const textClass = badgeClass === 'bg-dark' ? 'text-white' : '';
        return `<span class="badge ${badgeClass} ${textClass} ${index > 0 ? 'ms-1' : ''}">${tag}</span>`;
      })
      .join("");

    blogCard.innerHTML = `
      <a href="${post.url}" class="text-decoration-none text-dark">
        <div class="card blog-card h-100 d-flex flex-column shadow-sm rounded-4 hover-effect">
          <img src="${post.image}" class="card-img-top rounded-top-4" alt="${post.title}" />
          <div class="card-body d-flex flex-column">
            <div class="blog-meta">
              <span class="text-muted">${post.date}</span> •
              <span class="text-muted">${post.readTime}</span>
            </div>
            <h4 class="card-title mt-2">${post.title}</h4>
            <p class="blog-excerpt card-text flex-grow-1">
              ${post.excerpt}
            </p>
            <div class="mt-auto">
              ${tagsHTML}
            </div>
          </div>
        </div>
      </a>
    `;

    return blogCard;
  }

  showError() {
    if (this.blogContainer) {
      this.blogContainer.innerHTML = `
        <div class="col-12">
          <div class="alert alert-danger text-center" role="alert">
            <h4>Oops! Something went wrong</h4>
            <p>Unable to load blog posts. Please try refreshing the page.</p>
          </div>
        </div>
      `;
    }
  }
}

// Initialize blog loader when the page loads
window.addEventListener('DOMContentLoaded', () => {
  new MainBlogLoader();
  
  // Add click handler for View All Blogs button
  const viewAllButton = document.getElementById('viewAllBlogsBtn');
  if (viewAllButton) {
    viewAllButton.addEventListener('click', () => {
      window.location.href = 'blogs/index.html';
    });
  }
});
