---
layout: single
title: "Projects"
subtitle: "A showcase of my work and creative experiments"
permalink: "/projects/"
classes: wide
---

<!-- Hero Section -->
<section class="page-hero">
  <div class="container">
    <div class="hero-content">
      <h1 class="page-title">My Projects</h1>
      <p class="page-subtitle">A curated collection of my creative work and technical experiments</p>
    </div>
  </div>
</section>

<!-- Projects Section -->
<section class="projects-section">
  <div class="container">
    <!-- Filter Controls -->
    <div class="filter-controls">
      <div class="filter-buttons">
        <button class="filter-btn active" data-filter="all">
          <span class="filter-icon">📁</span>
          All Projects
        </button>
        <button class="filter-btn" data-filter="Web App">
          <span class="filter-icon">🌐</span>
          Web Apps
        </button>
        <button class="filter-btn" data-filter="Website">
          <span class="filter-icon">💻</span>
          Websites
        </button>
        <button class="filter-btn" data-filter="Design">
          <span class="filter-icon">🎨</span>
          Design
        </button>
        <button class="filter-btn" data-filter="Experiment">
          <span class="filter-icon">🧪</span>
          Experiments
        </button>
      </div>

      <div class="filter-stats">
        <span class="stats-text">Showing <span id="project-count">{{ site.projects | size }}</span> projects</span>
      </div>
    </div>

    <!-- Projects Grid -->
    <div class="projects-grid" id="projects-grid">
      {% assign sorted_projects = site.projects | sort: "date" | reverse %}
      {% for project in sorted_projects %}
      <article class="project-card {{ project.project_type | slugify }}" data-type="{{ project.project_type }}">
        <div class="card-image-wrapper">
          {% if project.header.image %}
            <img src="{{ project.header.image }}" alt="{{ project.title }}" class="card-image" loading="lazy">
          {% else %}
            <div class="card-image-placeholder">
              <span class="placeholder-icon">{{ project.title | truncate: 1, "" }}</span>
            </div>
          {% endif %}

          <!-- Status Badge -->
          {% if project.status %}
            <div class="status-badge status-{{ project.status | downcase | replace: ' ', '-' }}">
              {{ project.status }}
            </div>
          {% endif %}

          <!-- Featured Badge -->
          {% if project.featured %}
            <div class="featured-badge">
              <span>⭐</span>
            </div>
          {% endif %}

          <div class="card-overlay">
            <div class="card-content">
              <div class="card-header">
                <span class="project-type">{{ project.project_type }}</span>
                {% if project.date %}
                  <time class="project-date" datetime="{{ project.date | date: '%Y-%m-%d' }}">
                    {{ project.date | date: "%b %Y" }}
                  </time>
                {% endif %}
              </div>

              <h3 class="card-title">{{ project.title }}</h3>
              <p class="card-description">{{ project.description | truncate: 120 }}</p>

              {% if project.technologies %}
                <div class="tech-stack">
                  {% for tech in project.technologies limit: 4 %}
                    <span class="tech-tag">{{ tech }}</span>
                  {% endfor %}
                  {% if project.technologies.size > 4 %}
                    <span class="tech-more">+{{ project.technologies.size | minus: 4 }} more</span>
                  {% endif %}
                </div>
              {% endif %}

              <div class="card-actions">
                <a href="{{ project.url }}" class="btn btn-primary btn-small">View Details</a>
                {% if project.project_url %}
                  <a href="{{ project.project_url }}" target="_blank" class="btn btn-outline btn-small">
                    <span>🔗</span> Live Demo
                  </a>
                {% endif %}
                {% if project.github_url %}
                  <a href="{{ project.github_url }}" target="_blank" class="btn btn-outline btn-small">
                    <span>📄</span> Source
                  </a>
                {% endif %}
              </div>
            </div>
          </div>
        </div>
      </article>
      {% endfor %}
    </div>

    <!-- Load More (for future pagination) -->
    <div class="load-more" id="load-more" style="display: none;">
      <button class="btn btn-outline btn-large">Load More Projects</button>
    </div>
  </div>
</section>

<!-- Skills Section -->
<section class="skills-section">
  <div class="container">
    <div class="section-header">
      <h2 class="section-title">Technologies & Skills</h2>
      <p class="section-subtitle">Tools and technologies I work with</p>
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
        </div>
      </div>

      <div class="skill-category">
        <h3>Tools & Others</h3>
        <div class="skill-tags">
          <span class="skill-tag">Git</span>
          <span class="skill-tag">Docker</span>
          <span class="skill-tag">AWS</span>
          <span class="skill-tag">Figma</span>
          <span class="skill-tag">Adobe XD</span>
          <span class="skill-tag">Jekyll</span>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
/* Page Hero */
.page-hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4rem 0;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.page-hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25%" white 2px, transparent 2px"/><circle cx="75" cy="75%" white 2px, transparent 2px"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  opacity: 0.1;
}

.page-title {
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 700;
  margin-bottom: 1rem;
  position: relative;
  z-index: 1;
}

.page-subtitle {
  font-size: clamp(1.125rem, 3vw, 1.375rem);
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto 2rem auto;
  position: relative;
  z-index: 1;
}

/* Projects Section */
.projects-section {
  padding: 4rem 0;
  background: var(--secondary-color);
}

.filter-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.filter-buttons {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: white;
  border: 2px solid var(--border-color);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: var(--transition);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
}

.filter-btn:hover {
  border-color: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.filter-btn.active {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

.filter-icon {
  font-size: 1rem;
}

.filter-stats {
  color: var(--text-muted);
  font-size: 0.875rem;
}

#project-count {
  font-weight: 600;
  color: var(--primary-color);
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.project-card {
  background: white;
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
  transition: var(--transition);
  position: relative;
  border: 1px solid var(--border-color);
}

.project-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-xl);
  border-color: var(--primary-color);
}

.card-image-wrapper {
  position: relative;
  height: 240px;
  overflow: hidden;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: var(--transition);
}

.project-card:hover .card-image {
  transform: scale(1.05);
}

.card-image-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.placeholder-icon {
  font-size: 3rem;
  font-weight: 700;
  opacity: 0.8;
}

.status-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.375rem 0.75rem;
  border-radius: var(--radius-md);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  z-index: 2;
}

.status-completed {
  background: #10b981;
  color: white;
}

.status-in-progress {
  background: #f59e0b;
  color: white;
}

.status-on-hold {
  background: #6b7280;
  color: white;
}

.featured-badge {
  position: absolute;
  top: 1rem;
  left: 1rem;
  width: 2.5rem;
  height: 2.5rem;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-md);
  z-index: 2;
}

.card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: var(--transition);
  padding: 2rem;
}

.project-card:hover .card-overlay {
  opacity: 1;
}

.card-content {
  text-align: center;
  color: white;
  max-width: 280px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 0.75rem;
  opacity: 0.8;
}

.project-type {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-sm);
  font-weight: 500;
}

.project-date {
  font-weight: 500;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  line-height: 1.3;
}

.card-description {
  font-size: 0.875rem;
  opacity: 0.9;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.tech-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.tech-tag {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 500;
}

.tech-more {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  opacity: 0.8;
}

.card-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  flex-wrap: wrap;
}

.load-more {
  text-align: center;
  margin-top: 2rem;
}

/* Skills Section */
.skills-section {
  padding: 4rem 0;
  background: white;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.skill-category h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.skill-tag {
  background: var(--secondary-color);
  color: var(--text-primary);
  padding: 0.5rem 1rem;
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  font-weight: 500;
  border: 1px solid var(--border-color);
  transition: var(--transition);
}

.skill-tag:hover {
  background: var(--primary-color);
  color: white;
  transform: translateY(-1px);
}

/* Responsive Design */
@media (max-width: 768px) {
  .filter-controls {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-buttons {
    justify-content: center;
  }

  .projects-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .card-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .btn {
    width: 100%;
  }

  .skills-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}

@media (max-width: 480px) {
  .page-hero {
    padding: 3rem 0;
  }

  .page-title {
    font-size: clamp(2rem, 8vw, 3rem);
  }

  .card-image-wrapper {
    height: 200px;
  }

  .card-overlay {
    padding: 1rem;
  }

  .card-content {
    max-width: 100%;
  }
}

/* Enhanced filtering with animations */
.filter-btn {
  position: relative;
  overflow: hidden;
}

.filter-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s;
}

.filter-btn:hover::before {
  left: 100%;
}

/* Smooth card entrance animations */
.project-card {
  animation: fadeInUp 0.6s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
}

.project-card:nth-child(1) { animation-delay: 0.1s; }
.project-card:nth-child(2) { animation-delay: 0.2s; }
.project-card:nth-child(3) { animation-delay: 0.3s; }
.project-card:nth-child(4) { animation-delay: 0.4s; }
.project-card:nth-child(5) { animation-delay: 0.5s; }
.project-card:nth-child(6) { animation-delay: 0.6s; }

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Accessibility improvements */
@media (prefers-reduced-motion: reduce) {
  .project-card,
  .filter-btn::before {
    animation: none;
  }
}

/* Focus states for keyboard navigation */
.filter-btn:focus,
.btn:focus {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .card-overlay {
    background: rgba(0, 0, 0, 0.95);
  }

  .tech-tag,
  .skill-tag {
    border: 2px solid currentColor;
  }
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
