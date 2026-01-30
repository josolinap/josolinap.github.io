---
layout: single
title: "Projects"
subtitle: "A showcase of my work, experiments, and creative solutions"
permalink: "/projects/"
classes: wide
---

<div class="projects-hero">
  <h1 class="projects-title">Featured Projects</h1>
  <p class="projects-description">
    A curated collection of my best work, from AI-powered applications to high-performance web experiences. 
    Each project represents a unique challenge and innovative solution.
  </p>
</div>

<!-- Filter Buttons -->
<div class="filter-section">
  <button class="filter-btn active" data-filter="all">All Projects</button>
  <button class="filter-btn" data-filter="web-app">Web Apps</button>
  <button class="filter-btn" data-filter="ai">AI/ML</button>
  <button class="filter-btn" data-filter="website">Websites</button>
  <button class="filter-btn" data-filter="open-source">Open Source</button>
</div>

<!-- Projects Grid -->
<div class="projects-showcase" id="projects-showcase">
  {% assign sorted_projects = site.projects | sort: "date" | reverse %}
  {% for project in sorted_projects %}
  <article class="showcase-card" data-type="{{ project.project_type | slugify }}">
    <div class="card-visual">
      {% if project.header.image %}
        <img src="{{ project.header.image }}" alt="{{ project.title }}" loading="lazy">
      {% else %}
        <div class="card-placeholder">
          <span class="placeholder-icon">💻</span>
        </div>
      {% endif %}
      <div class="card-overlay">
        <div class="card-actions">
          {% if project.project_url %}
            <a href="{{ project.project_url }}" target="_blank" rel="noopener noreferrer" class="action-btn primary">
              <span>Live Demo</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </a>
          {% endif %}
          {% if project.github_url %}
            <a href="{{ project.github_url }}" target="_blank" rel="noopener noreferrer" class="action-btn secondary">
              <span>View Code</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
          {% endif %}
        </div>
      </div>
    </div>
    
    <div class="card-content">
      <div class="card-header">
        <h3 class="card-title">
          <a href="{{ project.url }}">{{ project.title }}</a>
        </h3>
        <div class="card-badges">
          <span class="badge type">{{ project.project_type }}</span>
          {% if project.status %}
            <span class="badge status-{{ project.status | downcase }}">{{ project.status }}</span>
          {% endif %}
          {% if project.featured %}
            <span class="badge featured">★ Featured</span>
          {% endif %}
        </div>
      </div>
      
      <p class="card-description">{{ project.description }}</p>
      
      {% if project.technologies %}
        <div class="tech-stack">
          {% for tech in project.technologies limit: 6 %}
            <span class="tech-pill">{{ tech }}</span>
          {% endfor %}
          {% if project.technologies.size > 6 %}
            <span class="tech-more">+{{ project.technologies.size | minus: 6 }}</span>
          {% endif %}
        </div>
      {% endif %}
      
      <div class="card-footer">
        <a href="{{ project.url }}" class="details-link">
          View Case Study
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </a>
        {% if project.date %}
          <span class="project-date">{{ project.date | date: "%b %Y" }}</span>
        {% endif %}
      </div>
    </div>
  </article>
  {% endfor %}
</div>

<!-- Skills Matrix Section -->
<div class="skills-matrix-section">
  <div class="section-header">
    <h2>Technology Matrix</h2>
    <p>Technologies I've mastered and regularly work with</p>
  </div>
  
  <div class="skills-matrix">
    <div class="matrix-category">
      <h4>Frontend Mastery</h4>
      <div class="skill-levels">
        <div class="skill-item expert">
          <span class="skill-name">React & Next.js</span>
          <div class="skill-bar">
            <div class="skill-fill" style="width: 95%"></div>
          </div>
          <span class="skill-badge">Expert</span>
        </div>
        <div class="skill-item expert">
          <span class="skill-name">TypeScript</span>
          <div class="skill-bar">
            <div class="skill-fill" style="width: 90%"></div>
          </div>
          <span class="skill-badge">Expert</span>
        </div>
        <div class="skill-item advanced">
          <span class="skill-name">Vue.js</span>
          <div class="skill-bar">
            <div class="skill-fill" style="width: 85%"></div>
          </div>
          <span class="skill-badge">Advanced</span>
        </div>
        <div class="skill-item expert">
          <span class="skill-name">CSS/Tailwind</span>
          <div class="skill-bar">
            <div class="skill-fill" style="width: 95%"></div>
          </div>
          <span class="skill-badge">Expert</span>
        </div>
      </div>
    </div>
    
    <div class="matrix-category">
      <h4>Backend & APIs</h4>
      <div class="skill-levels">
        <div class="skill-item advanced">
          <span class="skill-name">Node.js</span>
          <div class="skill-bar">
            <div class="skill-fill" style="width: 88%"></div>
          </div>
          <span class="skill-badge">Advanced</span>
        </div>
        <div class="skill-item advanced">
          <span class="skill-name">Python/Django</span>
          <div class="skill-bar">
            <div class="skill-fill" style="width: 82%"></div>
          </div>
          <span class="skill-badge">Advanced</span>
        </div>
        <div class="skill-item expert">
          <span class="skill-name">REST/GraphQL</span>
          <div class="skill-bar">
            <div class="skill-fill" style="width: 92%"></div>
          </div>
          <span class="skill-badge">Expert</span>
        </div>
        <div class="skill-item advanced">
          <span class="skill-name">PostgreSQL</span>
          <div class="skill-bar">
            <div class="skill-fill" style="width: 85%"></div>
          </div>
          <span class="skill-badge">Advanced</span>
        </div>
      </div>
    </div>
    
    <div class="matrix-category">
      <h4>AI & Emerging Tech</h4>
      <div class="skill-levels">
        <div class="skill-item expert">
          <span class="skill-name">Prompt Engineering</span>
          <div class="skill-bar">
            <div class="skill-fill" style="width: 93%"></div>
          </div>
          <span class="skill-badge">Expert</span>
        </div>
        <div class="skill-item advanced">
          <span class="skill-name">LLM Integration</span>
          <div class="skill-bar">
            <div class="skill-fill" style="width: 87%"></div>
          </div>
          <span class="skill-badge">Advanced</span>
        </div>
        <div class="skill-item intermediate">
          <span class="skill-name">LangChain</span>
          <div class="skill-bar">
            <div class="skill-fill" style="width: 78%"></div>
          </div>
          <span class="skill-badge">Intermediate</span>
        </div>
        <div class="skill-item advanced">
          <span class="skill-name">Vector DBs</span>
          <div class="skill-bar">
            <div class="skill-fill" style="width: 80%"></div>
          </div>
          <span class="skill-badge">Advanced</span>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- GitHub Stats Section -->
<div class="github-stats-section">
  <div class="section-header">
    <h2>Open Source Contributions</h2>
    <p>Active on GitHub with consistent contributions</p>
  </div>
  
  <div class="github-stats-grid">
    <div class="gh-stat-card">
      <div class="gh-icon">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      </div>
      <div class="gh-number" id="repo-count">--</div>
      <div class="gh-label">Public Repositories</div>
    </div>
    
    <div class="gh-stat-card">
      <div class="gh-icon">⭐</div>
      <div class="gh-number" id="star-count">--</div>
      <div class="gh-label">Total Stars</div>
    </div>
    
    <div class="gh-stat-card">
      <div class="gh-icon">🍴</div>
      <div class="gh-number" id="fork-count">--</div>
      <div class="gh-label">Total Forks</div>
    </div>
    
    <div class="gh-stat-card">
      <div class="gh-icon">📅</div>
      <div class="gh-number" id="contrib-count">500+</div>
      <div class="gh-label">Contributions (2024)</div>
    </div>
  </div>
  
  <div class="github-cta">
    <a href="https://github.com/josolinap" target="_blank" rel="noopener noreferrer" class="github-btn">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>
      View GitHub Profile
    </a>
  </div>
</div>

<style>
/* Projects Hero */
.projects-hero {
  text-align: center;
  padding: 3rem 0;
  margin-bottom: 2rem;
}

.projects-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #fff 0%, #888 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.projects-description {
  font-size: 1.125rem;
  color: #888;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.7;
}

/* Filter Section */
.filter-section {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  margin-bottom: 3rem;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 0.75rem 1.5rem;
  background: transparent;
  border: 1px solid #333;
  color: #888;
  border-radius: 8px;
  cursor: pointer;
  font-family: "JetBrains Mono", monospace;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: all 0.3s ease;
}

.filter-btn:hover,
.filter-btn.active {
  background: #00f0ff;
  border-color: #00f0ff;
  color: #050505;
}

/* Projects Showcase */
.projects-showcase {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
}

.showcase-card {
  background: rgba(17, 17, 17, 0.7);
  border: 1px solid #222;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.showcase-card:hover {
  transform: translateY(-8px);
  border-color: #00f0ff;
  box-shadow: 0 20px 40px -10px rgba(0, 240, 255, 0.1);
}

.card-visual {
  position: relative;
  height: 200px;
  overflow: hidden;
  background: linear-gradient(135deg, #161b22 0%, #0d1117 100%);
}

.card-visual img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.showcase-card:hover .card-visual img {
  transform: scale(1.05);
}

.card-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
}

.placeholder-icon {
  font-size: 4rem;
  opacity: 0.5;
}

.card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(5, 5, 5, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.showcase-card:hover .card-overlay {
  opacity: 1;
}

.card-actions {
  display: flex;
  gap: 1rem;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.3s ease;
}

.action-btn.primary {
  background: #00f0ff;
  color: #050505;
}

.action-btn.primary:hover {
  background: #fff;
  transform: scale(1.05);
}

.action-btn.secondary {
  background: transparent;
  color: #fff;
  border: 2px solid #333;
}

.action-btn.secondary:hover {
  border-color: #ff006e;
  color: #ff006e;
}

.card-content {
  padding: 1.5rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  gap: 1rem;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  line-height: 1.3;
}

.card-title a {
  color: #fff;
  text-decoration: none;
  transition: color 0.3s ease;
}

.card-title a:hover {
  color: #00f0ff;
}

.card-badges {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.badge.type {
  background: rgba(0, 240, 255, 0.1);
  color: #00f0ff;
  border: 1px solid rgba(0, 240, 255, 0.3);
}

.badge.status-completed {
  background: rgba(86, 211, 100, 0.1);
  color: #56d364;
  border: 1px solid rgba(86, 211, 100, 0.3);
}

.badge.status-in-progress {
  background: rgba(210, 153, 34, 0.1);
  color: #d29922;
  border: 1px solid rgba(210, 153, 34, 0.3);
}

.badge.featured {
  background: linear-gradient(135deg, #ffd700, #ffed4e);
  color: #050505;
}

.card-description {
  color: #888;
  font-size: 0.9375rem;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.tech-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.tech-pill {
  background: rgba(131, 56, 236, 0.1);
  color: #8338ec;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-family: "JetBrains Mono", monospace;
  border: 1px solid rgba(131, 56, 236, 0.3);
}

.tech-more {
  background: #222;
  color: #666;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.75rem;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #222;
}

.details-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #00f0ff;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.875rem;
  transition: gap 0.3s ease;
}

.details-link:hover {
  gap: 0.75rem;
}

.project-date {
  color: #666;
  font-size: 0.875rem;
  font-family: "JetBrains Mono", monospace;
}

/* Skills Matrix */
.skills-matrix-section {
  margin: 4rem 0;
  padding: 3rem 0;
  border-top: 1px solid #222;
  border-bottom: 1px solid #222;
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-header h2 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #fff;
}

.section-header p {
  color: #888;
  font-size: 1rem;
}

.skills-matrix {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.matrix-category {
  background: rgba(17, 17, 17, 0.5);
  border: 1px solid #222;
  border-radius: 12px;
  padding: 1.5rem;
}

.matrix-category h4 {
  color: #00f0ff;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #222;
}

.skill-levels {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.skill-item {
  display: grid;
  grid-template-columns: 1fr 100px 80px;
  align-items: center;
  gap: 1rem;
}

.skill-name {
  color: #fff;
  font-size: 0.9375rem;
  font-weight: 500;
}

.skill-bar {
  height: 6px;
  background: #222;
  border-radius: 3px;
  overflow: hidden;
}

.skill-fill {
  height: 100%;
  background: linear-gradient(90deg, #00f0ff, #8338ec);
  border-radius: 3px;
  transition: width 1s ease;
}

.skill-badge {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  text-align: center;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.skill-badge.expert {
  background: rgba(0, 240, 255, 0.1);
  color: #00f0ff;
}

.skill-badge.advanced {
  background: rgba(131, 56, 236, 0.1);
  color: #8338ec;
}

.skill-badge.intermediate {
  background: rgba(255, 0, 110, 0.1);
  color: #ff006e;
}

/* GitHub Stats */
.github-stats-section {
  margin: 4rem 0;
  text-align: center;
}

.github-stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

.gh-stat-card {
  background: rgba(17, 17, 17, 0.7);
  border: 1px solid #222;
  border-radius: 12px;
  padding: 2rem 1.5rem;
  transition: all 0.3s ease;
}

.gh-stat-card:hover {
  border-color: #00f0ff;
  transform: translateY(-4px);
}

.gh-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #00f0ff;
}

.gh-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: #fff;
  font-family: "JetBrains Mono", monospace;
  margin-bottom: 0.5rem;
}

.gh-label {
  color: #888;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.github-cta {
  margin-top: 2rem;
}

.github-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  background: transparent;
  border: 2px solid #333;
  color: #fff;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.github-btn:hover {
  border-color: #00f0ff;
  color: #00f0ff;
  box-shadow: 0 0 30px rgba(0, 240, 255, 0.2);
}

/* Responsive */
@media (max-width: 768px) {
  .projects-showcase {
    grid-template-columns: 1fr;
  }
  
  .skills-matrix {
    grid-template-columns: 1fr;
  }
  
  .skill-item {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
  
  .skill-bar {
    order: 2;
  }
  
  .skill-badge {
    order: 3;
    justify-self: start;
  }
  
  .filter-section {
    gap: 0.5rem;
  }
  
  .filter-btn {
    padding: 0.5rem 1rem;
    font-size: 0.75rem;
  }
  
  .card-actions {
    flex-direction: column;
    width: 100%;
    padding: 0 1rem;
  }
  
  .action-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>

<script>
// Filter functionality
document.addEventListener('DOMContentLoaded', function() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.showcase-card');
  
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
          card.style.animation = 'fadeIn 0.5s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
  
  // Load GitHub stats
  loadGitHubStats();
});

// Load GitHub statistics
async function loadGitHubStats() {
  const username = 'josolinap';
  
  try {
    const response = await fetch(`https://api.github.com/users/${username}`);
    const data = await response.json();
    
    if (response.ok) {
      document.getElementById('repo-count').textContent = data.public_repos;
    }
    
    // Load repos for stars and forks
    const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
    const repos = await reposResponse.json();
    
    if (reposResponse.ok) {
      const totalStars = repos.reduce((acc, repo) => acc + repo.stargazers_count, 0);
      const totalForks = repos.reduce((acc, repo) => acc + repo.forks_count, 0);
      
      document.getElementById('star-count').textContent = totalStars;
      document.getElementById('fork-count').textContent = totalForks;
    }
  } catch (error) {
    console.error('Error loading GitHub stats:', error);
  }
}
</script>
