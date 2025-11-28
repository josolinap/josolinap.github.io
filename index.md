---
layout: home
author_profile: true
classes: wide
---

<!-- Hero Section -->
<section class="hero-section">
  <div class="container">
    <div class="hero-content">
      <h1 class="hero-title">Hi, I'm Josolina</h1>
      <p class="hero-subtitle">Creative developer crafting beautiful digital experiences</p>
      <div class="hero-cta">
        <a href="/projects" class="btn btn-primary">View My Work</a>
        <a href="/about" class="btn btn-secondary">About Me</a>
      </div>
    </div>
  </div>
  <div class="hero-bg-pattern"></div>
</section>

<!-- Featured Projects -->
<section class="featured-section">
  <div class="container">
    <div class="section-header">
      <h2 class="section-title">Featured Projects</h2>
      <p class="section-subtitle">A curated selection of my recent work</p>
    </div>

    <div class="projects-grid">
      {% assign featured_projects = site.projects | where: "featured", true | limit: 6 %}
      {% for project in featured_projects %}
      <article class="project-card">
        <div class="card-image-wrapper">
          {% if project.header.image %}
            <img src="{{ project.header.image }}" alt="{{ project.title }}" class="card-image" loading="lazy">
          {% else %}
            <div class="card-image-placeholder">
              <span class="placeholder-icon">{{ project.title | truncate: 1, "" }}</span>
            </div>
          {% endif %}
          <div class="card-overlay">
            <div class="card-content">
              <h3 class="card-title">{{ project.title }}</h3>
              <p class="card-description">{{ project.description | truncate: 100 }}</p>
              <div class="card-actions">
                <a href="{{ project.url }}" class="btn btn-small">View Details</a>
                {% if project.project_url %}
                  <a href="{{ project.project_url }}" target="_blank" class="btn btn-small btn-outline">Live Demo</a>
                {% endif %}
              </div>
            </div>
          </div>
        </div>
      </article>
      {% endfor %}
    </div>

    <div class="section-footer">
      <a href="/projects" class="btn btn-large">Explore All Projects</a>
    </div>
  </div>
</section>

<!-- Stats Section -->
<section class="stats-section">
  <div class="container">
    <div class="stats-grid">
      <div class="stat-item">
        <div class="stat-number">{{ site.projects | size }}</div>
        <div class="stat-label">Projects Completed</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">{{ site.posts | size }}</div>
        <div class="stat-label">Articles Written</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">3+</div>
        <div class="stat-label">Years Experience</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">50+</div>
        <div class="stat-label">Happy Clients</div>
      </div>
    </div>
  </div>
</section>

<!-- Latest Posts -->
<section class="posts-section">
  <div class="container">
    <div class="section-header">
      <h2 class="section-title">Latest Thoughts</h2>
      <p class="section-subtitle">Insights and tutorials from my development journey</p>
    </div>

    <div class="posts-grid">
      {% assign latest_posts = site.posts | sort: "date" | reverse | limit: 3 %}
      {% for post in latest_posts %}
      <article class="post-card">
        <div class="post-content">
          <div class="post-categories">
            {% for category in post.categories limit: 2 %}
              <span class="category-tag">{{ category }}</span>
            {% endfor %}
          </div>
          <h3 class="post-title">
            <a href="{{ post.url }}">{{ post.title }}</a>
          </h3>
          <p class="post-excerpt">{{ post.excerpt | strip_html | truncate: 150 }}</p>
          <div class="post-footer">
            <time class="post-date" datetime="{{ post.date | date: '%Y-%m-%d' }}">
              {{ post.date | date: "%b %d, %Y" }}
            </time>
            <span class="post-read-time">{{ post.content | number_of_words | divided_by: 200 | plus: 1 }} min read</span>
          </div>
        </div>
      </article>
      {% endfor %}
    </div>

    <div class="section-footer">
      <a href="/blog" class="btn btn-outline">Read All Posts</a>
    </div>
  </div>
</section>

<!-- CTA Section -->
<section class="cta-section">
  <div class="container">
    <div class="cta-content">
      <h2>Let's Work Together</h2>
      <p>I'm always excited to take on new challenges and collaborate on interesting projects.</p>
      <a href="/contact" class="btn btn-primary btn-large">Get In Touch</a>
    </div>
  </div>
</section>

<style>
/* Import Google Fonts for better typography */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');

/* CSS Custom Properties for consistent theming */
:root {
  --primary-color: #6366f1;
  --primary-dark: #4f46e5;
  --secondary-color: #f8fafc;
  --accent-color: #e11d48;
  --text-primary: #1e293b;
  --text-secondary: #64748b;
  --text-muted: #94a3b8;
  --border-color: #e2e8f0;
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Global Styles */
* {
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
  color: var(--text-primary);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Typography */
h1, h2, h3, h4, h5, h6 {
  font-family: 'Playfair Display', serif;
  font-weight: 600;
  line-height: 1.2;
  margin: 0 0 1rem 0;
  color: var(--text-primary);
}

h1 { font-size: clamp(2.5rem, 5vw, 4rem); font-weight: 700; }
h2 { font-size: clamp(2rem, 4vw, 3rem); }
h3 { font-size: clamp(1.5rem, 3vw, 2.25rem); }
h4 { font-size: clamp(1.25rem, 2.5vw, 1.875rem); }

p {
  margin: 0 0 1.5rem 0;
  color: var(--text-secondary);
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  border-radius: var(--radius-lg);
  border: 1px solid transparent;
  cursor: pointer;
  transition: var(--transition);
  position: relative;
  overflow: hidden;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: var(--primary-color);
  color: white;
  box-shadow: var(--shadow-md);
}

.btn-primary:hover:not(:disabled) {
  background: var(--primary-dark);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.btn-secondary {
  background: white;
  color: var(--text-primary);
  border-color: var(--border-color);
  box-shadow: var(--shadow-sm);
}

.btn-secondary:hover:not(:disabled) {
  background: var(--secondary-color);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-outline {
  background: transparent;
  color: var(--text-primary);
  border-color: var(--border-color);
}

.btn-outline:hover:not(:disabled) {
  background: var(--text-primary);
  color: white;
}

.btn-large {
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
}

.btn-small {
  padding: 0.5rem 1rem;
  font-size: 0.75rem;
}

/* Sections */
section {
  padding: 5rem 0;
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
}

.section-title {
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.section-subtitle {
  font-size: 1.125rem;
  color: var(--text-muted);
  max-width: 600px;
  margin: 0 auto;
}

.section-footer {
  text-align: center;
  margin-top: 3rem;
}

/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-xl);
  margin: 2rem;
}

.hero-bg-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.1;
  background-image:
    radial-gradient(circle at 25% 25%, white 2px, transparent 2px),
    radial-gradient(circle at 75% 75%, white 2px, transparent 2px);
  background-size: 50px 50px;
}

.hero-content {
  position: relative;
  z-index: 1;
  padding: 6rem 2rem;
  text-align: center;
}

.hero-title {
  font-size: clamp(2.5rem, 8vw, 4.5rem);
  font-weight: 700;
  margin-bottom: 1rem;
  letter-spacing: -0.02em;
}

.hero-subtitle {
  font-size: clamp(1.125rem, 4vw, 1.375rem);
  opacity: 0.9;
  margin-bottom: 2.5rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  font-weight: 400;
}

.hero-cta {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

/* Featured Projects */
.featured-section {
  background: var(--secondary-color);
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
}

.project-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-xl);
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

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.card-description {
  font-size: 0.875rem;
  opacity: 0.9;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.card-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  flex-wrap: wrap;
}

/* Stats Section */
.stats-section {
  background: white;
  border-top: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  text-align: center;
}

.stat-item {
  padding: 2rem 1rem;
}

.stat-number {
  font-size: 3rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
  font-family: 'Playfair Display', serif;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-muted);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Posts Section */
.posts-section {
  background: var(--secondary-color);
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.post-card {
  background: white;
  padding: 2rem;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  transition: var(--transition);
  border: 1px solid var(--border-color);
}

.post-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: var(--primary-color);
}

.post-categories {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.category-tag {
  background: var(--primary-color);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.post-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  line-height: 1.3;
}

.post-title a {
  color: var(--text-primary);
  text-decoration: none;
  transition: var(--transition);
}

.post-title a:hover {
  color: var(--primary-color);
}

.post-excerpt {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.post-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  color: var(--text-muted);
}

.post-date {
  font-weight: 500;
}

.post-read-time {
  opacity: 0.8;
}

/* CTA Section */
.cta-section {
  background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
  color: white;
  text-align: center;
}

.cta-content {
  max-width: 600px;
  margin: 0 auto;
}

.cta-content h2 {
  font-size: clamp(2rem, 5vw, 3rem);
  margin-bottom: 1rem;
  color: white;
}

.cta-content p {
  font-size: 1.125rem;
  opacity: 0.9;
  margin-bottom: 2rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .container {
    padding: 0 1rem;
  }

  section {
    padding: 3rem 0;
  }

  .hero-content {
    padding: 4rem 1rem;
  }

  .hero-title {
    font-size: clamp(2rem, 10vw, 3.5rem);
  }

  .hero-cta {
    flex-direction: column;
    align-items: center;
  }

  .projects-grid,
  .posts-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }

  .stat-item {
    padding: 1.5rem 0.5rem;
  }

  .card-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .hero-section {
    margin: 1rem;
    border-radius: var(--radius-lg);
  }

  .section-header {
    margin-bottom: 2rem;
  }

  .post-footer {
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
  }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Focus states */
.btn:focus,
a:focus {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

/* Print styles */
@media print {
  .hero-section,
  .cta-section {
    background: white !important;
    color: black !important;
  }

  .btn {
    display: none;
  }
}
</style>
