document.addEventListener("DOMContentLoaded", function() {
    // Fetch projects data from JSON file
    fetch("projects/projects-data.json")
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(projects => {
            // Get first 3 projects from the array
            const topProjects = projects.slice(0, 3);
            
            const projectsContainer = document.getElementById('projects-container');
            if (!projectsContainer) {
                console.error('Projects container not found');
                return;
            }

            // Clear any loading state
            projectsContainer.innerHTML = '';

            // Create project cards
            topProjects.forEach(project => {
                const projectCard = document.createElement('div');
                projectCard.className = 'col-md-6 col-lg-4 mb-4';

                // Map technology names to their respective logo files
                const techIcons = project.technologies
                    .map(tech => {
                        const logoMap = {
                            'javascript': 'JavaScript.png',
                            'html5': 'html.webp',
                            'css3': 'CSS.png',
                            'figma': 'figma.png',
                            'photoshop': 'photoshop.png',
                            'react': 'react.webp',
                            'nodejs': 'node-js.png',
                            'openai': 'chatgpt.png',
                            'python': 'python.webp',
                            'mongodb': 'MongoDB.png',
                            'express': 'express-js.png',
                            'tensorflow': 'tensorflow.png',
                            'firebase': 'firebase.png',
                            'tailwind': 'tailwindcss.png'
                        };

                        const logoFile = logoMap[tech] || 'code.png';
                        return `<img src="assets/logos/${logoFile}" alt="${tech}" class="project-skill-logo" title="${tech}">`;
                    })
                    .join('');

                projectCard.innerHTML = `
                    <div class="cardsize hover-sound-trigger">
                        <div class="card project-card h-100 d-flex flex-column shadow-sm rounded-4 hover-effect">
                            <div class="position-relative">
                                <img src="${project.image}" class="card-img-top rounded-top-4" alt="${project.title}" />
                                <div class="project-card-overlay">
                                    <div class="d-flex gap-2">
                                        ${project.demoUrl !== '#' ? `
                                            <a href="${project.demoUrl}" class="btn btn-sm btn-light" target="_blank" rel="noopener noreferrer">
                                                <i class="bi bi-eye"></i> Demo
                                            </a>
                                        ` : ''}
                                        ${project.codeUrl !== '#' ? `
                                            <a href="${project.codeUrl}" class="btn btn-sm btn-outline-light" target="_blank" rel="noopener noreferrer">
                                                <i class="bi bi-github"></i> Code
                                            </a>
                                        ` : ''}
                                    </div>
                                </div>
                            </div>
                            <div class="card-body d-flex flex-column">
                                <div class="project-meta">
                                    <span class="text-muted">${project.date}</span>
                                </div>
                                <h4 class="card-title mt-1">${project.title}</h4>
                                <p class="project-description card-text flex-grow-1">
                                    ${project.description}
                                </p>
                                <div class="mt-auto pt-2">
                                    <div class="tech-stack d-flex flex-wrap gap-2">
                                        ${techIcons}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                projectsContainer.appendChild(projectCard);
            });
        })
        .catch(error => {
            console.error('Error loading projects:', error);
            const projectsContainer = document.getElementById('projects-container');
            if (projectsContainer) {
                projectsContainer.innerHTML = `
                    <div class="col-12 text-center py-3">
                        <div class="alert alert-warning">
                            <i class="bi bi-exclamation-triangle-fill me-2"></i>
                            Unable to load projects. Please check back later.
                        </div>
                    </div>
                `;
            }
        });
});
