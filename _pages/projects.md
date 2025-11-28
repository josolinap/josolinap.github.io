---
layout: single
title: "Projects"
subtitle: "A showcase of my work and creative experiments"
permalink: "/projects/"
classes: wide
---

<div class="readme-header">
  <div class="readme-content">
    <h1>📁 Projects</h1>
    <p>A comprehensive collection of web development projects and experiments</p>
  </div>
</div>

<div class="projects-section">
  <div class="projects-grid">
    {% assign sorted_projects = site.projects | sort: "date" | reverse %}
    {% for project in sorted_projects %}
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

      <p class="card-description">{{ project.description | truncate: 140 }}</p>

      {% if project.technologies %}
        <div class="tech-stack">
          {% for tech in project.technologies limit: 5 %}
            <span class="tech-tag">{{ tech }}</span>
          {% endfor %}
          {% if project.technologies.size > 5 %}
            <span class="tech-more">+{{ project.technologies.size | minus: 5 }} more</span>
          {% endif %}
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

<style>
/* GitHub Dark Mode */
@import url('https://fonts.googleapis.com/css2?family/Inter:wght@400;500;600&display=swap');

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

/* Projects Section */
.projects-section {
  padding: 2rem 0;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
  gap: 1rem;
  padding: 0 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.project-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  padding: 1.25rem;
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
  margin-bottom: 0.75rem;
}

.card-title {
  font-size: 1.1rem;
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
  gap: 0.375rem;
  flex-shrink: 0;
}

.badge {
  background: var(--accent-blue);
  color: var(--bg-primary);
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
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

.tech-more {
  background: var(--bg-tertiary);
  color: var(--text-muted);
  padding: 0.125rem 0.375rem;
  border-radius: 3px;
  font-size: 0.625rem;
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

/* Responsive Design */
@media (max-width: 768px) {
  .projects-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .readme-header {
    padding: 2rem 1rem;
  }

  .projects-section,
  .skills-section {
    padding: 1.5rem 0;
  }

  .section-header {
    padding: 0 1rem;
  }

  .skills-grid {
    padding: 0 1rem;
  }
}

@media (max-width: 480px) {
  .projects-grid {
    padding: 0 1rem;
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .card-badges {
    align-self: flex-end;
  }
}

/* Focus states */
.card-link:focus,
a:focus {
  outline: 2px solid var(--accent-blue);
  outline-offset: 2px;
}
</style>

<script>
// Pinterest-style filtering
document.addEventListener('DOMContentLoaded', function() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      // Add active class to clicked button
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

      projectCards.forEach(card => {
        if (filterValue === 'all' || card.getAttribute('data-type') === filterValue) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
});
</script>
