// Blog loader functionality
class BlogLoader {
  constructor() {
    this.blogContainer = null;
    this.init();
  }

  async init() {
    // Wait for DOM to be ready
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.loadBlogs());
    } else {
      this.loadBlogs();
    }
  }

  async loadBlogs() {
    try {
      this.blogContainer = document.querySelector(".row.g-4");

      if (!this.blogContainer) {
        console.error("Blog container not found");
        return;
      }

      // Fetch blog data from JSON file
      const response = await fetch("./blogData.json");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blogPosts = await response.json();
      this.renderBlogs(blogPosts);

      // Initialize animations after content is loaded
      this.initializeAnimations();
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
    blogCard.className = "col-md-6 col-lg-4";

    const tagsHTML = post.tags
      .map((tag) => `<span class="badge bg-primary me-1">${tag}</span>`)
      .join("");

    blogCard.innerHTML = `
        <div class="cardsize hover-sound-trigger">
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
        </div>
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

  initializeAnimations() {
    // Initialize scroll animations if the function exists
    if (typeof initScrollAnimations === "function") {
      initScrollAnimations();
    }
  }
}

// Initialize blog loader
new BlogLoader();
