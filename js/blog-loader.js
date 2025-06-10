/**
 * Unified Blog Loader
 * Handles loading and displaying blog posts consistently across the entire platform
 */
class UnifiedBlogLoader {
  constructor(options = {}) {
    this.options = {
      containerSelector: '.blogs-grid', // Default container selector for home page
      limit: 0, // 0 means no limit
      showLoadMore: false,
      ...options
    };
    
    this.blogContainer = null;
    this.init();
  }

  async init() {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.loadBlogs());
    } else {
      setTimeout(() => this.loadBlogs(), 100);
    }
  }

  async loadBlogs() {
    try {
      // Find the container
      this.blogContainer = document.querySelector(this.options.containerSelector);
      
      // Fallback for blogs page
      if (!this.blogContainer) {
        const mainContent = document.querySelector('main.container');
        this.blogContainer = mainContent?.querySelector('.row.g-4') || document.querySelector('.row.g-4');
      }

      if (!this.blogContainer) {
        throw new Error("Blog container not found");
      }

      // Show loading state
      this.showLoading();

      // Fetch blog data - use relative path based on current page
      const isBlogsPage = window.location.pathname.includes('blogs');
      const blogDataPath = isBlogsPage ? './blogData.json' : 'blogs/blogData.json';
      const response = await fetch(blogDataPath);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      let blogPosts = await response.json();
      
      // Apply limit if specified (for home page)
      if (this.options.limit > 0) {
        blogPosts = blogPosts.slice(0, this.options.limit);
      }

      // Render the posts
      this.renderBlogs(blogPosts);
      
      // Initialize animations
      this.initializeAnimations();
      
    } catch (error) {
      console.error("Error loading blog posts:", error);
      this.showError(error.message);
    }
  }

  renderBlogs(blogPosts) {
    // Clear existing content
    this.blogContainer.innerHTML = '';

    blogPosts.forEach(post => {
      const blogCard = this.createBlogCard(post);
      this.blogContainer.appendChild(blogCard);
    });

    // Add load more button if enabled
    if (this.options.showLoadMore) {
      this.addLoadMoreButton();
    }
  }

  createBlogCard(post) {
    const blogCard = document.createElement("div");
    blogCard.className = this.options.limit > 0 
      ? "cardsize col hover-sound-trigger" 
      : "col-md-6 col-lg-4 hover-sound-trigger";

    // Create colorful badges for tags
    const tagsHTML = post.tags
      .map((tag, index) => {
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

    // Create the blog card HTML
    blogCard.innerHTML = `
      <div class="cardsize">
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

  showLoading() {
    this.blogContainer.innerHTML = `
      <div class="col-12 text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-2 text-muted">Loading blog posts...</p>
      </div>
    `;
  }

  showError(message = 'Unable to load blog posts. Please try refreshing the page.') {
    const errorContainer = this.blogContainer || document.querySelector('main.container') || document.body;
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'col-12';
    errorDiv.innerHTML = `
      <div class="alert alert-danger text-center" role="alert">
        <h4>Oops! Something went wrong</h4>
        <p>${message}</p>
      </div>
    `;
    
    errorContainer.prepend(errorDiv);
    console.error('Blog Loader Error:', message);
  }

  initializeAnimations() {
    if (typeof initScrollAnimations === "function") {
      initScrollAnimations();
    }
  }
}

// Helper function to check if we're on the blogs page
function isBlogsPage() {
  // Check if the current path includes 'blogs' and we're not on the root
  const path = window.location.pathname;
  return path.includes('blogs') || path.endsWith('blogs.html') || path.endsWith('blogs/');
}

// Initialize based on the current page
document.addEventListener('DOMContentLoaded', () => {
  try {
    const isBlogPage = isBlogsPage();
    
    if (isBlogPage) {
      // Full blogs page - show all posts
      new UnifiedBlogLoader({
        containerSelector: 'main.container .row.g-4',
        limit: 0,
        showLoadMore: false
      });
    } else {
      // Home page - show limited posts
      new UnifiedBlogLoader({
        containerSelector: '.blogs-grid',
        limit: 3,
        showLoadMore: false
      });
    }
  } catch (error) {
    console.error('Error initializing blog loader:', error);
    // Fallback to home page behavior if there's an error
    if (document.querySelector('.blogs-grid')) {
      new UnifiedBlogLoader({
        containerSelector: '.blogs-grid',
        limit: 3,
        showLoadMore: false
      });
    }
  }
});
