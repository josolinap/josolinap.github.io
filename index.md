---
layout: home
author_profile: true
classes: wide
---

<div class="hero-section">
  <div class="hero-content">
    <h1>Welcome to My Portfolio</h1>
    <p class="hero-subtitle">I'm Josolina, a creative developer passionate about building beautiful web experiences and innovative solutions.</p>
    <div class="hero-actions">
      <a href="/projects" class="cta-button primary">View My Work</a>
      <a href="/about" class="cta-button secondary">Learn More</a>
    </div>
  </div>
</div>

## Featured Projects

<div class="featured-projects-grid">
  {% assign featured_projects = site.projects | where: "featured", true | limit: 6 %}
  {% for project in featured_projects %}
  <div class="featured-card">
    <div class="card-image">
      {% if project.header.image %}
        <img src="{{ project.header.image }}" alt="{{ project.title }}" loading="lazy">
      {% else %}
        <div class="card-placeholder">
          <span>{{ project.title | truncate: 2, "" }}</span>
        </div>
      {% endif %}
      <div class="card-overlay">
        <div class="card-content">
          <h3>{{ project.title }}</h3>
          <p>{{ project.description | truncate: 80 }}</p>
          <a href="{{ project.url }}" class="card-link">View Project</a>
        </div>
      </div>
    </div>
  </div>
  {% endfor %}
</div>

<div class="explore-section">
  <h2>Explore My Work</h2>
  <p>Discover my latest projects, experiments, and creative endeavors</p>
  <a href="/projects" class="explore-button">Browse All Projects</a>
</div>

## Latest Posts

<div class="latest-posts">
  {% assign latest_posts = site.posts | sort: "date" | reverse | limit: 3 %}
  {% for post in latest_posts %}
  <article class="post-card">
    <div class="post-content">
      <h3><a href="{{ post.url }}">{{ post.title }}</a></h3>
      <p class="post-excerpt">{{ post.excerpt | strip_html | truncate: 120 }}</p>
      <div class="post-meta">
        <time>{{ post.date | date: "%B %d, %Y" }}</time>
        {% if post.categories %}
          <span class="post-category">{{ post.categories | join: ", " }}</span>
        {% endif %}
      </div>
    </div>
  </article>
  {% endfor %}
</div>

<style>
/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 80px 20px;
  text-align: center;
  margin-bottom: 60px;
  border-radius: 20px;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="50" cy="10" r="0.5" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  opacity: 0.1;
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 800px;
  margin: 0 auto;
}

.hero-content h1 {
  font-size: 3.5rem;
  margin-bottom: 20px;
  font-weight: 700;
}

.hero-subtitle {
  font-size: 1.3rem;
  margin-bottom: 40px;
  opacity: 0.9;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.cta-button {
  padding: 15px 30px;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  display: inline-block;
}

.cta-button.primary {
  background: white;
  color: #667eea;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
}

.cta-button.secondary {
  background: transparent;
  color: white;
  border: 2px solid white;
}

.cta-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.3);
}

/* Featured Projects Grid */
.featured-projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
  margin: 60px 0;
}

.featured-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  position: relative;
}

.featured-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 40px rgba(0,0,0,0.2);
}

.card-image {
  position: relative;
  height: 250px;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.featured-card:hover .card-image img {
  transform: scale(1.05);
}

.card-placeholder {
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

.card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.featured-card:hover .card-overlay {
  opacity: 1;
}

.card-content {
  text-align: center;
  color: white;
  padding: 20px;
}

.card-content h3 {
  margin: 0 0 15px 0;
  font-size: 1.5rem;
}

.card-content p {
  margin: 0 0 20px 0;
  opacity: 0.9;
  line-height: 1.5;
}

.card-link {
  background: white;
  color: #333;
  padding: 10px 25px;
  border-radius: 25px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  display: inline-block;
}

.card-link:hover {
  background: #f0f0f0;
  transform: translateY(-2px);
}

/* Explore Section */
.explore-section {
  text-align: center;
  padding: 60px 20px;
  background: #f8f9fa;
  border-radius: 20px;
  margin: 60px 0;
}

.explore-section h2 {
  color: #333;
  margin-bottom: 15px;
  font-size: 2.5rem;
}

.explore-section p {
  color: #666;
  font-size: 1.2rem;
  margin-bottom: 30px;
}

.explore-button {
  background: #e60023;
  color: white;
  padding: 15px 40px;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  display: inline-block;
}

.explore-button:hover {
  background: #c0001d;
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(230, 0, 35, 0.3);
}

/* Latest Posts */
.latest-posts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
  margin-top: 60px;
}

.post-card {
  background: white;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  transition: all 0.3s ease;
}

.post-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0,0,0,0.12);
}

.post-card h3 {
  margin: 0 0 15px 0;
  font-size: 1.4rem;
}

.post-card h3 a {
  color: #333;
  text-decoration: none;
  transition: color 0.3s ease;
}

.post-card h3 a:hover {
  color: #667eea;
}

.post-excerpt {
  color: #666;
  line-height: 1.6;
  margin-bottom: 20px;
}

.post-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  color: #888;
}

.post-category {
  background: #f0f0f0;
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 0.8rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-content h1 {
    font-size: 2.5rem;
  }

  .hero-subtitle {
    font-size: 1.1rem;
  }

  .hero-actions {
    flex-direction: column;
    align-items: center;
  }

  .featured-projects-grid,
  .latest-posts {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .explore-section h2 {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .hero-section {
    padding: 50px 20px;
  }

  .hero-content h1 {
    font-size: 2rem;
  }

  .featured-card,
  .post-card {
    margin: 0 10px;
  }
}
</style>
