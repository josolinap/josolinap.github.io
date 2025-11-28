---
layout: home
author_profile: true
classes: wide
---

<div class="readme-header">
  <div class="readme-content">
    <h1>🚀 Portfolio</h1>
    <p>A collection of projects and experiments in web development</p>
    <div class="readme-badges">
      <span class="badge">React</span>
      <span class="badge">Node.js</span>
      <span class="badge">TypeScript</span>
      <span class="badge">Python</span>
    </div>
  </div>
</div>

<div class="stats-bar">
  <div class="stat-item">
    <span class="stat-number">{{ site.projects | size }}</span>
    <span class="stat-label">Projects</span>
  </div>
  <div class="stat-item">
    <span class="stat-number">{{ site.posts | size }}</span>
    <span class="stat-label">Articles</span>
  </div>
  <div class="stat-item">
    <span class="stat-number">50+</span>
    <span class="stat-label">Commits</span>
  </div>
</div>

<div class="projects-section">
  <div class="section-header">
    <h2>📁 Projects</h2>
    <a href="/projects" class="view-all-link">View all →</a>
  </div>

  <div class="projects-grid">
    {% assign featured_projects = site.projects | where: "featured", true | limit: 6 %}
    {% for project in featured_projects %}
    <div class="project-card">
      <div class="card-header">
        <h3 class="card-title">
          <a href="{{ project.url }}">{{ project.title }}</a>
        </h3>
        <div class="card-badges">
          <span class="badge badge-small">{{ project.project_type }}</span>
          {% if project.status %}
            <span class="badge badge-{{ project.status | downcase }}">{{ project.status }}</span>
          {% endif %}
        </div>
      </div>

      <p class="card-description">{{ project.description | truncate: 120 }}</p>

      {% if project.technologies %}
        <div class="tech-stack">
          {% for tech in project.technologies limit: 4 %}
            <span class="tech-tag">{{ tech }}</span>
          {% endfor %}
        </div>
      {% endif %}

      <div class="card-footer">
        <div class="card-links">
          <a href="{{ project.url }}" class="card-link">📄 Details</a>
          {% if project.project_url %}
            <a href="{{ project.project_url }}" target="_blank" class="card-link">🌐 Demo</a>
          {% endif %}
          {% if project.github_url %}
            <a href="{{ project.github_url }}" target="_blank" class="card-link">📦 Code</a>
          {% endif %}
        </div>
        {% if project.date %}
          <span class="card-date">{{ project.date | date: "%b %Y" }}</span>
        {% endif %}
      </div>
    </div>
    {% endfor %}
  </div>
</div>

<div class="skills-section">
  <div class="section-header">
    <h2>🛠️ Technologies</h2>
  </div>

  <div class="skills-grid">
    <div class="skill-category">
      <h3>Frontend</h3>
      <div class="skill-tags">
        <span class="skill-tag">React</span>
        <span class="skill-tag">Vue.js</span>
        <span class="skill-tag">JavaScript</span>
        <span class="skill-tag">TypeScript</span>
        <span class="skill-tag">HTML5</span>
        <span class="skill-tag">CSS3</span>
        <span class="skill-tag">Sass</span>
        <span class="skill-tag">Tailwind</span>
      </div>
    </div>

    <div class="skill-category">
      <h3>Backend</h3>
      <div class="skill-tags">
        <span class="skill-tag">Node.js</span>
        <span class="skill-tag">Python</span>
        <span class="skill-tag">PostgreSQL</span>
        <span class="skill-tag">MongoDB</span>
        <span class="skill-tag">Express</span>
        <span class="skill-tag">Django</span>
        <span class="skill-tag">GraphQL</span>
      </div>
    </div>

    <div class="skill-category">
      <h3>Tools & DevOps</h3>
      <div class="skill-tags">
        <span class="skill-tag">Git</span>
        <span class="skill-tag">Docker</span>
        <span class="skill-tag">AWS</span>
        <span class="skill-tag">Vercel</span>
        <span class="skill-tag">Figma</span>
        <span class="skill-tag">Jest</span>
        <span class="skill-tag">Webpack</span>
      </div>
    </div>
  </div>
</div>

<div class="repos-section">
  <div class="section-header">
    <h2>📦 Repositories</h2>
    <a href="https://github.com/josolinap" target="_blank" class="view-all-link">View on GitHub →</a>
  </div>

  <div id="repos-list" class="repos-list">
    <!-- Repositories will be loaded dynamically -->
    <div class="loading">Loading repositories...</div>
  </div>
</div>

<script>
// GitHub API integration
async function loadGitHubRepos() {
  const username = 'josolinap';
  const reposList = document.getElementById('repos-list');

  try {
    // Fetch repositories
    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=5`);
    const repos = await response.json();

    if (!response.ok) {
      throw new Error('Failed to fetch repositories');
    }

    // Clear loading message
    reposList.innerHTML = '';

    // Display repositories
    for (const repo of repos) {
      if (repo.fork) continue; // Skip forked repos

      const repoCard = document.createElement('div');
      repoCard.className = 'repo-card';

      repoCard.innerHTML = `
        <div class="repo-header">
          <h3 class="repo-title">
            <a href="${repo.html_url}" target="_blank">${repo.name}</a>
          </h3>
          <div class="repo-badges">
            ${repo.language ? `<span class="badge">${repo.language}</span>` : ''}
            ${repo.archived ? '<span class="badge badge-archived">Archived</span>' : ''}
          </div>
        </div>

        <p class="repo-description">${repo.description || 'No description available'}</p>

        <div class="repo-stats">
          <span class="stat">
            <span class="stat-icon">⭐</span>
            ${repo.stargazers_count}
          </span>
          <span class="stat">
            <span class="stat-icon">🍴</span>
            ${repo.forks_count}
          </span>
          <span class="stat">
            <span class="stat-icon">📅</span>
            ${new Date(repo.updated_at).toLocaleDateString()}
          </span>
        </div>
      `;

      reposList.appendChild(repoCard);
    }

  } catch (error) {
    reposList.innerHTML = `
      <div class="error-message">
        Failed to load repositories. <a href="https://github.com/${username}" target="_blank">View on GitHub</a>
      </div>
    `;
    console.error('GitHub API Error:', error);
  }
}

// Load repositories when page loads
document.addEventListener('DOMContentLoaded', loadGitHubRepos);
</script>

<style>
/* GitHub Dark Mode */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

:root {
  --bg-primary: #0d1117;
  --bg-secondary: #161b22;
  --bg-tertiary: #21262d;
  --text-primary: #f0f0f0;
  --text-secondary: #c9d1d9;
  --text-muted: #8b949e;
  --border-color: #30363d;
  --border-hover: #58a6ff;
  --accent-blue: #58a6ff;
  --accent-green: #56d364;
  --shadow: 0 8px 24px rgba(1, 4, 9, 0.25);
  --radius: 6px;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  line-height: 1.5;
  color: var(--text-primary);
  background: var(--bg-primary);
  -webkit-font-smoothing: antialiased;
}

/* README Header */
.readme-header {
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  padding: 3rem 2rem;
}

.readme-content h1 {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.readme-content p {
  font-size: 1rem;
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
}

.readme-badges {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.badge {
  background: var(--accent-blue);
  color: var(--bg-primary);
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
}

/* Stats Bar */
.stats-bar {
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  padding: 1rem 2rem;
  display: flex;
  gap: 2rem;
  justify-content: center;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.stat-number {
  color: var(--accent-green);
  font-weight: 600;
}

/* Sections */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 0 2rem;
}

.section-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.view-all-link {
  color: var(--accent-blue);
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
}

.view-all-link:hover {
  text-decoration: underline;
}

/* Projects Section */
.projects-section {
  padding: 2rem 0;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1rem;
  padding: 0 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.project-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  padding: 1rem;
  transition: all 0.2s ease;
}

.project-card:hover {
  border-color: var(--border-hover);
  background: var(--bg-tertiary);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.card-title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
}

.card-title a {
  color: var(--text-primary);
  text-decoration: none;
}

.card-title a:hover {
  color: var(--accent-blue);
}

.card-badges {
  display: flex;
  gap: 0.25rem;
  flex-shrink: 0;
}

.badge-small {
  font-size: 0.625rem;
  padding: 0.125rem 0.375rem;
  background: var(--bg-tertiary);
  color: var(--text-secondary);
}

.badge-completed {
  background: var(--accent-green);
  color: var(--bg-primary);
}

.badge-in-progress {
  background: #d29922;
  color: var(--bg-primary);
}

.card-description {
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin-bottom: 0.75rem;
  line-height: 1.5;
}

.tech-stack {
  display: flex;
  gap: 0.25rem;
  flex-wrap: wrap;
  margin-bottom: 0.75rem;
}

.tech-tag {
  background: var(--bg-tertiary);
  color: var(--text-secondary);
  padding: 0.125rem 0.375rem;
  border-radius: 3px;
  font-size: 0.625rem;
  font-weight: 500;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-links {
  display: flex;
  gap: 1rem;
}

.card-link {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.card-link:hover {
  color: var(--accent-blue);
}

.card-date {
  color: var(--text-muted);
  font-size: 0.75rem;
}

/* Skills Section */
.skills-section {
  padding: 2rem 0;
  border-top: 1px solid var(--border-color);
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  padding: 0 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.skill-category h3 {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.skill-tag {
  background: var(--bg-secondary);
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
  padding: 0.25rem 0.5rem;
  border-radius: 3px;
  font-size: 0.75rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.skill-tag:hover {
  background: var(--accent-blue);
  color: var(--bg-primary);
  border-color: var(--accent-blue);
}

/* Repositories Section */
.repos-section {
  padding: 2rem 0;
  border-top: 1px solid var(--border-color);
}

.repos-list {
  padding: 0 2rem;
  max-width: 1000px;
  margin: 0 auto;
}

.repo-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  padding: 1rem;
  margin-bottom: 1rem;
  transition: all 0.2s ease;
}

.repo-card:hover {
  border-color: var(--border-hover);
  background: var(--bg-tertiary);
}

.repo-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.repo-title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
}

.repo-title a {
  color: var(--text-primary);
  text-decoration: none;
}

.repo-title a:hover {
  color: var(--accent-blue);
}

.repo-badges {
  display: flex;
  gap: 0.25rem;
  flex-shrink: 0;
}

.badge-archived {
  background: var(--text-muted);
  color: var(--bg-primary);
}

.repo-description {
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin-bottom: 0.75rem;
  line-height: 1.5;
}

.repo-stats {
  display: flex;
  gap: 1rem;
  font-size: 0.75rem;
  color: var(--text-muted);
}

.stat {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.stat-icon {
  font-size: 0.875rem;
}

.loading {
  text-align: center;
  color: var(--text-muted);
  padding: 2rem;
  font-size: 0.875rem;
}

.error-message {
  text-align: center;
  color: #f85149;
  padding: 2rem;
  font-size: 0.875rem;
}

.error-message a {
  color: var(--accent-blue);
  text-decoration: none;
}

.error-message a:hover {
  text-decoration: underline;
}

/* Stats Section */
.stats {
  display: flex;
  justify-content: center;
  gap: 3rem;
  padding: 3rem 2rem;
  background: white;
  margin: 0 2rem;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  margin-top: -2rem;
  position: relative;
  z-index: 2;
}

.stat {
  text-align: center;
}

.stat .number {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--primary);
  display: block;
  margin-bottom: 0.5rem;
}

.stat .label {
  font-size: 0.875rem;
  color: var(--text-medium);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Featured Projects */
.featured-projects {
  padding: 5rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.featured-projects h2 {
  font-size: 2.5rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 3rem;
  color: var(--text-dark);
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.project-card {
  background: white;
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: var(--shadow);
  transition: all 0.3s ease;
}

.project-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0,0,0,0.15);
}

.project-image {
  height: 220px;
  overflow: hidden;
}

.project-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.project-card:hover .project-image img {
  transform: scale(1.05);
}

.project-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, var(--primary), var(--primary-light));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
  font-weight: 700;
}

.project-info {
  padding: 1.5rem;
}

.project-info h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: var(--text-dark);
}

.project-info p {
  color: var(--text-medium);
  margin-bottom: 1rem;
  line-height: 1.5;
}

.project-link {
  color: var(--primary);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.875rem;
  transition: color 0.2s ease;
}

.project-link:hover {
  color: var(--primary-light);
}

.view-all {
  text-align: center;
}

/* Latest Posts */
.latest-posts {
  padding: 5rem 2rem;
  background: white;
  margin: 0 2rem;
  border-radius: var(--radius);
}

.latest-posts h2 {
  font-size: 2.5rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 3rem;
  color: var(--text-dark);
}

.posts-list {
  max-width: 800px;
  margin: 0 auto;
}

.post-item {
  padding: 2rem 0;
  border-bottom: 1px solid var(--border);
}

.post-item:last-child {
  border-bottom: none;
}

.post-item h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.post-item h3 a {
  color: var(--text-dark);
  text-decoration: none;
  transition: color 0.2s ease;
}

.post-item h3 a:hover {
  color: var(--primary);
}

.post-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
  color: var(--text-light);
}

.post-meta span {
  font-weight: 500;
}

/* CTA Section */
.cta {
  padding: 5rem 2rem;
  text-align: center;
  background: linear-gradient(135deg, var(--primary), var(--primary-light));
  color: white;
  margin: 0 2rem;
  border-radius: var(--radius);
}

.cta h2 {
  font-size: 2.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.cta p {
  font-size: 1.125rem;
  opacity: 0.9;
  margin-bottom: 2rem;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero {
    padding: 4rem 1rem;
  }

  .hero h1 {
    font-size: clamp(2rem, 8vw, 3rem);
  }

  .hero-buttons {
    flex-direction: column;
    align-items: center;
  }

  .stats {
    flex-direction: column;
    gap: 2rem;
    margin: 0 1rem;
    margin-top: -2rem;
  }

  .projects-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .featured-projects,
  .latest-posts,
  .cta {
    padding: 3rem 1rem;
    margin: 0 1rem;
  }

  .featured-projects h2,
  .latest-posts h2,
  .cta h2 {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .hero {
    padding: 3rem 1rem;
  }

  .stats {
    margin: 0 0.5rem;
    margin-top: -2rem;
  }

  .featured-projects,
  .latest-posts,
  .cta {
    margin: 0 0.5rem;
  }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  * {
    transition: none !important;
    animation: none !important;
  }
}

/* Focus states */
.btn-primary:focus,
.btn-secondary:focus,
a:focus {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}
</style>
