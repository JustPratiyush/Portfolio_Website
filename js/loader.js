/**
 * @file Unified loader for dynamic content (blogs and projects).
 * @description Fetches data and populates the respective containers.
 */
document.addEventListener("DOMContentLoaded", () => {
  const isBlogsPage = window.location.pathname.includes("/blogs/");
  const isProjectsPage = window.location.pathname.includes("/projects/");
  const basePath = isBlogsPage || isProjectsPage ? "../" : "";

  // Load blogs on home page or blogs page
  if (isBlogsPage) {
    // On blogs page, use the blogs-container ID
    console.log("Loading blogs page content...");
    loadContent({
      containerId: "blogs-container",
      // Use absolute path from the root to avoid any path resolution issues
      dataPath: "/blogs/blogData.json",
      cardGenerator: createBlogCard,
      limit: 0, // No limit on blogs page
      isBlogsPage: true,
    });
  } else {
    // On home page, look for the blogs-grid
    const blogsContainer = document.getElementById("blogs-grid");
    if (blogsContainer) {
      console.log("Loading blog posts for homepage...");
      loadContent({
        containerId: "blogs-grid",
        dataPath: "/blogs/blogData.json", // Use absolute path from root
        cardGenerator: createBlogCard,
        limit: 3, // Show only 3 on home page
        isBlogsPage: false,
      });
    }
  }

  // Load projects on home page or projects page
  const projectsContainer =
    document.getElementById("projects-container") ||
    document.querySelector("#projects .row.g-4");
  if (projectsContainer || isProjectsPage) {
    const containerId = projectsContainer
      ? projectsContainer.id
      : "projects-container";
    const container =
      containerId === "projects-container"
        ? projectsContainer
        : document.getElementById(containerId);

    if (container) {
      loadContent({
        containerId,
        dataPath: `${basePath}projects/projects-data.json`,
        cardGenerator: createProjectCard,
        limit: isProjectsPage ? 0 : 3, // No limit on projects page, limit to 3 on home page
        isProjectsPage: true,
      });
    } else {
      console.warn("Projects container not found");
    }
  }
});

async function loadContent(options) {
  const {
    containerId,
    dataPath,
    cardGenerator,
    limit = 0,
    isBlogsPage = false,
    isProjectsPage = false,
  } = options;
  console.group(`Loading content for: ${containerId}`);
  console.log("Options:", {
    containerId,
    dataPath,
    limit,
    isBlogsPage,
    isProjectsPage,
  });

  const container =
    document.getElementById(containerId) ||
    document.querySelector(`.${containerId}`);
  if (!container) {
    const errorMsg = `Container with ID/class '${containerId}' not found`;
    console.error(errorMsg);
    console.groupEnd();
    return;
  }

  console.log("Container found:", container);

  // Show loading state
  if ((isBlogsPage || isProjectsPage) && container) {
    container.innerHTML = `
      <div class="col-12 text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-2 text-muted">Loading content...</p>
      </div>`;
  }

  try {
    console.log(`Fetching data from: ${dataPath}`);
    const response = await fetch(dataPath);

    if (!response.ok) {
      const errorText = await response.text();
      const errorMsg = `Failed to load data from ${dataPath}: ${response.status} ${response.statusText}\n${errorText}`;
      console.error("Error response:", errorMsg);
      throw new Error(errorMsg);
    }

    let data = await response.json();
    console.log("Successfully loaded data:", data);

    if (!Array.isArray(data)) {
      throw new Error(`Expected an array of items but got: ${typeof data}`);
    }

    if (limit && limit > 0) {
      console.log(`Limiting to ${limit} items`);
      data = data.slice(0, limit);
    }

    console.log(`Rendering ${data.length} items to container`);
    container.innerHTML = "";

    const fragment = document.createDocumentFragment();
    data.forEach((item, index) => {
      try {
        console.log(
          `Creating card for item ${index + 1}:`,
          item.title || "Untitled"
        );
        const card = cardGenerator(item);
        if (card) {
          fragment.appendChild(card);
        }
      } catch (cardError) {
        console.error(`Error creating card for item ${index + 1}:`, cardError);
        const errorCard = document.createElement("div");
        errorCard.className = "col-12";
        errorCard.innerHTML = `
          <div class="alert alert-warning">
            Error loading item ${index + 1}
            ${
              process.env.NODE_ENV === "development"
                ? `<br><small>${cardError.message}</small>`
                : ""
            }
          </div>`;
        fragment.appendChild(errorCard);
      }
    });

    container.appendChild(fragment);
    console.log("Successfully rendered all items");
  } catch (error) {
    console.error(`Error loading content for ${containerId}:`, error);
    const errorHtml = `
      <div class="col-12 text-center">
        <div class="alert alert-danger">
          <h5>Failed to load content</h5>
          <p>Please try again later or contact support if the problem persists.</p>
          ${
            process.env.NODE_ENV === "development"
              ? `
            <hr>
            <p class="small text-muted mb-0">${error.message}</p>
            <pre class="small text-start text-muted mt-2">${error.stack}</pre>
          `
              : ""
          }
        </div>
      </div>`;

    container.innerHTML = errorHtml;
  } finally {
    console.groupEnd(); // Close the debugging group
  }
}

function createBlogCard(post) {
  console.log("Creating blog card for:", post.title);

  // Create card container
  const card = document.createElement("div");
  const isHomepage = !window.location.pathname.includes("/blogs/");
  card.className = isHomepage
    ? "blog-card-container"
    : "col-12 col-md-6 col-lg-4 mb-4 blog-card-container";

  try {
    // Create card HTML with proper error handling for missing fields
    const imageSrc = post.image || "../assets/images/placeholder-blog.jpg";
    const date = post.date || "";
    const readTime = post.readTime || "";
    const excerpt = post.excerpt || "No excerpt available.";
    const url = post.url || "#";
    const tags = Array.isArray(post.tags) ? post.tags : [];

    // Create tags HTML if available
    const tagsHtml =
      tags.length > 0
        ? `<div class="blog-tags">
           ${tags.map((tag) => `<span class="blog-tag">${tag}</span>`).join("")}
         </div>`
        : "";

    card.innerHTML = `
      <a href="${url}" class="blog-card-link text-decoration-none text-reset d-block h-100">
        <div class="card h-100 shadow-sm border-0 overflow-hidden">
          <div class="position-relative">
            <img src="${imageSrc}" 
                 class="card-img-top blog-card-img" 
                 alt="${post.title || "Blog post image"}"
                 onerror="this.onerror=null; this.src='../assets/images/placeholder-blog.jpg';">
            ${tagsHtml}
          </div>
          <div class="card-body d-flex flex-column">
            <div class="blog-card-content">
              ${
                date || readTime
                  ? `<p class="text-muted small mb-2">${[date, readTime]
                      .filter(Boolean)
                      .join(" · ")}</p>`
                  : ""
              }
              <h4 class="card-title h5 mb-3">${
                post.title || "Untitled Post"
              }</h4>
              <p class="card-text text-muted">${excerpt}</p>
            </div>
          </div>
        </div>
      </a>`;
  } catch (error) {
    console.error("Error creating blog card:", error);
    card.innerHTML = `
      <div class="card h-100">
        <div class="card-body">
          <h5 class="card-title">Error Loading Post</h5>
          <p class="card-text">There was an error loading this blog post.</p>
        </div>
      </div>`;
  }

  return card;
}

function createProjectCard(project) {
  const card = document.createElement("div");
  card.className = "col-md-6 col-lg-4 mb-4";

  // Map technology names to their respective logo files
  const techIcons = project.technologies
    ? project.technologies
        .map((tech) => {
          const logoMap = {
            javascript: "JavaScript.png",
            html5: "html.webp",
            css3: "CSS.png",
            figma: "figma.png",
            photoshop: "photoshop.png",
            react: "react.webp",
            nodejs: "node-js.png",
            openai: "chatgpt.png",
            python: "python.webp",
            mongodb: "MongoDB.png",
            express: "express-js.png",
            tensorflow: "tensorflow.png",
            firebase: "firebase.png",
            tailwind: "tailwindcss.png",
          };

          const logoFile = logoMap[tech.toLowerCase()] || "code.png";
          const basePath = window.location.pathname.includes("/projects/")
            ? "../"
            : "";
          return `<img src="${basePath}assets/logos/${logoFile}" alt="${tech}" class="project-skill-logo" title="${tech}">`;
        })
        .join("")
    : "";

  // Determine the primary URL (prefer demo URL, fall back to code URL)
  const primaryUrl =
    project.demoUrl && project.demoUrl !== "#"
      ? project.demoUrl
      : project.codeUrl && project.codeUrl !== "#"
      ? project.codeUrl
      : "#";

  card.innerHTML = `
    <a href="${primaryUrl}" class="project-card-link" target="_blank" rel="noopener noreferrer">
      <div class="cardsize hover-sound-trigger">
        <div class="card project-card h-100 d-flex flex-column shadow-sm rounded-4 hover-effect">
          <div class="position-relative">
            <img src="${project.image}" class="card-img-top" alt="${
    project.title
  }">
          </div>
          <div class="card-body d-flex flex-column">
            <div class="project-meta">
              <span class="text-muted">${project.date || ""}</span>
              <h4 class="card-title mt-1">${project.title}</h4>
              <p class="card-text">${project.description || ""}</p>
            </div>
            <div class="mt-auto pt-3">
              <div class="tech-stack d-flex flex-wrap gap-2">${techIcons}</div>
            </div>
          </div>
        </div>
      </div>
    </a>`;
  return card;
}
