---
layout: home
author_profile: true
classes: wide
---

<div class="hero">
  <div class="hero-content">
    <h1>Hi, I'm Josolina</h1>
    <p>Creative developer crafting digital experiences</p>
    <div class="hero-buttons">
      <a href="/projects" class="btn-primary">View Projects</a>
      <a href="/about" class="btn-secondary">About Me</a>
    </div>
  </div>
</div>

<div class="stats">
  <div class="stat">
    <div class="number">{{ site.projects | size }}</div>
    <div class="label">Projects</div>
  </div>
  <div class="stat">
    <div class="number">{{ site.posts | size }}</div>
    <div class="label">Articles</div>
  </div>
  <div class="stat">
    <div class="number">3+</div>
    <div class="label">Years</div>
  </div>
</div>

<div class="featured-projects">
  <h2>Featured Work</h2>
  <div class="projects-grid">
    {% assign featured_projects = site.projects | where: "featured", true | limit: 3 %}
    {% for project in featured_projects %}
    <div class="project-card">
      <div class="project-image">
        {% if project.header.image %}
          <img src="{{ project.header.image }}" alt="{{ project.title }}">
        {% else %}
          <div class="project-placeholder">{{ project.title | truncate: 1, "" }}</div>
        {% endif %}
      </div>
      <div class="project-info">
        <h3>{{ project.title }}</h3>
        <p>{{ project.description | truncate: 80 }}</p>
        <a href="{{ project.url }}" class="project-link">View Project</a>
      </div>
    </div>
    {% endfor %}
  </div>
  <div class="view-all">
    <a href="/projects" class="btn-secondary">View All Projects</a>
  </div>
</div>

<div class="latest-posts">
  <h2>Latest Posts</h2>
  <div class="posts-list">
    {% assign latest_posts = site.posts | sort: "date" | reverse | limit: 3 %}
    {% for post in latest_posts %}
    <div class="post-item">
      <h3><a href="{{ post.url }}">{{ post.title }}</a></h3>
      <div class="post-meta">
        <span>{{ post.date | date: "%b %d, %Y" }}</span>
        <span>{{ post.content | number_of_words | divided_by: 200 | plus: 1 }} min read</span>
      </div>
    </div>
    {% endfor %}
  </div>
</div>

<div class="cta">
  <h2>Let's Work Together</h2>
  <p>Available for new projects and collaborations</p>
  <a href="/contact" class="btn-primary">Get In Touch</a>
</div>

<style>
/* Clean, modern design with excellent color combinations */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

:root {
  --primary: #4f46e5;
  --primary-light: #6366f1;
  --secondary: #f8fafc;
  --accent: #10b981;
  --text-dark: #1f2937;
  --text-medium: #6b7280;
  --text-light: #9ca3af;
  --border: #e5e7eb;
  --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --radius: 12px;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  line-height: 1.6;
  color: var(--text-dark);
  background: var(--secondary);
}

/* Hero Section */
.hero {
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
  color: white;
  padding: 6rem 2rem;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 30% 70%, rgba(255,255,255,0.1) 0%, transparent 50%),
              radial-gradient(circle at 70% 30%, rgba(255,255,255,0.1) 0%, transparent 50%);
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 800px;
  margin: 0 auto;
}

.hero h1 {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 600;
  margin-bottom: 1rem;
  letter-spacing: -0.02em;
}

.hero p {
  font-size: 1.25rem;
  opacity: 0.9;
  margin-bottom: 2rem;
  font-weight: 400;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-primary {
  background: white;
  color: var(--primary);
  padding: 0.875rem 2rem;
  border-radius: var(--radius);
  text-decoration: none;
  font-weight: 500;
  font-size: 1rem;
  transition: all 0.2s ease;
  box-shadow: var(--shadow);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.btn-secondary {
  background: transparent;
  color: white;
  padding: 0.875rem 2rem;
  border: 2px solid white;
  border-radius: var(--radius);
  text-decoration: none;
  font-weight: 500;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: white;
  color: var(--primary);
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
