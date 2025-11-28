---
layout: single
title: "Projects"
subtitle: "A showcase of my work and creative experiments"
permalink: "/projects/"
classes: wide
---

<div class="pinterest-grid">
  <!-- Category Filter -->
  <div class="category-filter">
    <button class="filter-btn active" data-filter="all">All Projects</button>
    <button class="filter-btn" data-filter="Web App">Web Apps</button>
    <button class="filter-btn" data-filter="Website">Websites</button>
    <button class="filter-btn" data-filter="Design">Design</button>
    <button class="filter-btn" data-filter="Experiment">Experiments</button>
  </div>

  <!-- Projects Grid -->
  <div class="projects-container">
    {% assign sorted_projects = site.projects | sort: "date" | reverse %}
    {% for project in sorted_projects %}
    <div class="project-card {{ project.project_type | slugify }}" data-type="{{ project.project_type }}">
      <div class="project-image">
        {% if project.header.image %}
          <img src="{{ project.header.image }}" alt="{{ project.title }}" loading="lazy">
        {% else %}
          <div class="placeholder-image">
            <span>{{ project.title | truncate: 2, "" }}</span>
          </div>
        {% endif %}

        <div class="project-overlay">
          <div class="project-info">
            <h3>{{ project.title }}</h3>
            <p>{{ project.description | truncate: 100 }}</p>
            <div class="project-meta">
              {% if project.technologies %}
                <div class="tech-stack">
                  {% for tech in project.technologies limit: 3 %}
                    <span class="tech-tag">{{ tech }}</span>
                  {% endfor %}
                </div>
              {% endif %}
              <div class="project-links">
                <a href="{{ project.url }}" class="view-project">View Details</a>
                {% if project.project_url %}
                  <a href="{{ project.project_url }}" target="_blank" class="live-demo">Live Demo</a>
                {% endif %}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    {% endfor %}
  </div>
</div>

<style>
.pinterest-grid {
  max-width: 1200px;
  margin: 0 auto;
}

.category-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 30px;
  justify-content: center;
}

.filter-btn {
  background: #f0f0f0;
  border: none;
  padding: 10px 20px;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

.filter-btn.active {
  background: #e60023;
  color: white;
}

.filter-btn:hover {
  background: #e60023;
  color: white;
  transform: translateY(-2px);
}

.projects-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.project-card {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  position: relative;
}

.project-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.project-image {
  position: relative;
  overflow: hidden;
  height: 250px;
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

.placeholder-image {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 48px;
  font-weight: bold;
}

.project-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.8);
  display: flex;
  align-items: flex-end;
  opacity: 0;
  transition: opacity 0.3s ease;
  padding: 20px;
}

.project-card:hover .project-overlay {
  opacity: 1;
}

.project-info h3 {
  color: white;
  margin: 0 0 10px 0;
  font-size: 18px;
}

.project-info p {
  color: #ccc;
  margin: 0 0 15px 0;
  font-size: 14px;
  line-height: 1.4;
}

.tech-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 15px;
}

.tech-tag {
  background: rgba(255,255,255,0.2);
  color: white;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 12px;
}

.project-links {
  display: flex;
  gap: 10px;
}

.view-project, .live-demo {
  padding: 8px 16px;
  border-radius: 20px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.view-project {
  background: white;
  color: #333;
}

.live-demo {
  background: #e60023;
  color: white;
}

.view-project:hover {
  background: #f0f0f0;
}

.live-demo:hover {
  background: #c0001d;
}

/* Responsive Design */
@media (max-width: 768px) {
  .projects-container {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 15px;
  }

  .category-filter {
    justify-content: flex-start;
    overflow-x: auto;
    padding-bottom: 10px;
  }

  .filter-btn {
    white-space: nowrap;
  }
}

@media (max-width: 480px) {
  .projects-container {
    grid-template-columns: 1fr;
  }

  .project-image {
    height: 200px;
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
