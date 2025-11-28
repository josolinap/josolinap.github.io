---
layout: single
title: "Projects"
subtitle: "A showcase of my work and creative experiments"
permalink: "/projects/"
classes: wide
---

<div class="page-header">
  <h1>My Projects</h1>
  <p>A curated collection of my creative work and technical experiments</p>
</div>

<div class="projects-section">
  <div class="projects-grid">
    {% assign sorted_projects = site.projects | sort: "date" | reverse %}
    {% for project in sorted_projects %}
    <div class="project-card">
      <div class="project-image">
        {% if project.header.image %}
          <img src="{{ project.header.image }}" alt="{{ project.title }}">
        {% else %}
          <div class="project-placeholder">{{ project.title | truncate: 1, "" }}</div>
        {% endif %}
      </div>
      <div class="project-info">
        <div class="project-meta">
          <span class="project-type">{{ project.project_type }}</span>
          {% if project.date %}
            <span class="project-date">{{ project.date | date: "%b %Y" }}</span>
          {% endif %}
        </div>
        <h3>{{ project.title }}</h3>
        <p>{{ project.description | truncate: 100 }}</p>

        {% if project.technologies %}
          <div class="tech-stack">
            {% for tech in project.technologies limit: 3 %}
              <span class="tech-tag">{{ tech }}</span>
            {% endfor %}
          </div>
        {% endif %}

        <div class="project-links">
          <a href="{{ project.url }}" class="project-link">View Details</a>
          {% if project.project_url %}
            <a href="{{ project.project_url }}" target="_blank" class="project-link">Live Demo</a>
          {% endif %}
        </div>
      </div>
    </div>
    {% endfor %}
  </div>
</div>

<div class="skills-section">
  <h2>Technologies & Skills</h2>
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

<style>
/* Clean, simple design */
.page-header {
  text-align: center;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, var(--primary), var(--primary-light));
  color: white;
}

.page-header h1 {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 600;
  margin-bottom: 1rem;
}

.page-header p {
  font-size: 1.25rem;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
}

.projects-section {
  padding: 4rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.projects-section h2 {
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
  margin-bottom: 4rem;
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

.project-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: var(--text-medium);
}

.project-type {
  background: var(--secondary);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-weight: 500;
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

.tech-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.tech-tag {
  background: var(--accent);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.75rem;
  font-weight: 500;
}

.project-links {
  display: flex;
  gap: 1rem;
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

.skills-section {
  padding: 4rem 2rem;
  background: var(--secondary);
  margin: 0 2rem;
  border-radius: var(--radius);
}

.skills-section h2 {
  font-size: 2.5rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 3rem;
  color: var(--text-dark);
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  max-width: 1000px;
  margin: 0 auto;
}

.skill-category h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--text-dark);
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.skill-tag {
  background: white;
  color: var(--text-dark);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  border: 1px solid var(--border);
  transition: all 0.2s ease;
}

.skill-tag:hover {
  background: var(--primary);
  color: white;
  transform: translateY(-1px);
}

/* Responsive */
@media (max-width: 768px) {
  .projects-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .skills-grid {
    grid-template-columns: 1fr;
  }

  .page-header {
    padding: 3rem 1rem;
  }

  .projects-section,
  .skills-section {
    padding: 3rem 1rem;
    margin: 0 1rem;
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
