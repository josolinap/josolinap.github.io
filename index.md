---
layout: home
author_profile: true
title: "Josolina - Creative Developer & Designer"
description: "Portfolio and blog showcasing creative projects and development work by Josolina. Explore web development, design, and creative coding."
header:
  overlay_color: "#000"
  overlay_filter: "0.5"
---

<!-- PWA Manifest and Service Worker -->
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#58a6ff">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Josolina">

<!-- Structured Data for SEO -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Josolina",
  "url": "https://josolinap.dedyn.io",
  "image": "https://josolinap.dedyn.io/assets/images/profile.jpg",
  "sameAs": [
    "https://github.com/josolinap",
    "https://linkedin.com/in/josolina",
    "https://twitter.com/josolina",
    "https://instagram.com/josolina"
  ],
  "jobTitle": "Creative Developer & Designer",
  "description": "Creative developer passionate about building beautiful web experiences.",
  "email": "mailto:jomonsolinap@gmail.com"
}
</script>

<!-- Service Worker Registration -->
<script>
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration);
        })
        .catch((error) => {
          console.log('Service Worker registration failed:', error);
        });
    });
  }
</script>

<!-- Modern Blog Section with GitHub Repos -->
<section class="blog-section" id="blog">
  <div class="blog-header">
    <div class="blog-title-wrapper">
      <h2 class="blog-title">Latest from GitHub</h2>
      <p class="blog-subtitle">Explore my open-source projects and experiments</p>
    </div>
    <a href="https://github.com/josolinap" target="_blank" class="github-link">
      <svg class="github-icon" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>
      <span>View All on GitHub</span>
      <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M7 17L17 7M17 7H7M17 7V17"/>
      </svg>
    </a>
  </div>

  <div class="repo-grid" id="repo-grid">
    <div class="loading-state">
      <div class="loading-spinner"></div>
      <p>Loading repositories...</p>
    </div>
  </div>
</section>

<!-- README Modal -->
<div id="readme-modal" class="modal" style="display: none;">
  <div class="modal-backdrop" onclick="closeModal()"></div>
  <div class="modal-container">
    <div class="modal-header">
      <div class="modal-title-wrapper">
        <div class="repo-icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
        </div>
        <h3 id="modal-title" class="modal-title">Repository Name</h3>
      </div>
      <button class="modal-close" onclick="closeModal()" aria-label="Close modal">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      </button>
    </div>
    <div class="modal-body">
      <div id="modal-content" class="modal-content">
        <div class="loading-state">
          <div class="loading-spinner"></div>
          <p>Loading README...</p>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <a id="modal-github-link" href="#" target="_blank" class="github-btn">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
        <span>View on GitHub</span>
      </a>
    </div>
  </div>
</div>

<!-- Marked.js for Markdown parsing -->
<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>

<script>
// GitHub API Integration with Modern UI
const username = 'josolinap';
const repoGrid = document.getElementById('repo-grid');
const modal = document.getElementById('readme-modal');
const modalTitle = document.getElementById('modal-title');
const modalContent = document.getElementById('modal-content');
const modalGithubLink = document.getElementById('modal-github-link');

// Language color mapping
const languageColors = {
  'JavaScript': '#f1e05a',
  'TypeScript': '#2b7489',
  'HTML': '#e34c26',
  'CSS': '#563d7c',
  'Python': '#3572A5',
  'Java': '#b07219',
  'Ruby': '#701516',
  'Go': '#00ADD8',
  'Rust': '#dea584',
  'C++': '#f34b7d',
  'C': '#555555',
  'Swift': '#ffac45',
  'Kotlin': '#A97BFF',
  'PHP': '#4F5D95',
  'Shell': '#89e051',
  'Vue': '#41b883',
  'React': '#61dafb',
  'SCSS': '#c6538c',
  'Sass': '#c6538c',
  'Jupyter Notebook': '#da5b0b'
};

// Fetch and display repositories
async function loadRepositories() {
  try {
    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=12`);
    const repos = await response.json();

    if (!response.ok) {
      throw new Error('Failed to fetch repositories');
    }

    // Clear loading state
    repoGrid.innerHTML = '';

    // Filter out forks and create cards
    const nonForkRepos = repos.filter(repo => !repo.fork);
    
    nonForkRepos.forEach((repo, index) => {
      const card = createRepoCard(repo, index);
      repoGrid.appendChild(card);
    });

  } catch (error) {
    console.error('Error loading repos:', error);
    repoGrid.innerHTML = `
      <div class="error-state">
        <svg class="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <p>Failed to load repositories</p>
        <a href="https://github.com/${username}" target="_blank" class="retry-link">View on GitHub →</a>
      </div>
    `;
  }
}

// Create repository card
function createRepoCard(repo, index) {
  const card = document.createElement('article');
  card.className = 'repo-card';
  card.style.animationDelay = `${index * 0.1}s`;
  
  const languageColor = languageColors[repo.language] || '#8b949e';
  const updatedDate = new Date(repo.updated_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  card.innerHTML = `
    <div class="repo-card-header">
      <div class="repo-icon-wrapper">
        <svg class="repo-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      </div>
      <h3 class="repo-name">${repo.name}</h3>
    </div>
    
    <p class="repo-description">${repo.description || 'No description available'}</p>
    
    <div class="repo-meta">
      ${repo.language ? `
        <div class="repo-language">
          <span class="language-dot" style="background-color: ${languageColor}"></span>
          <span>${repo.language}</span>
        </div>
      ` : ''}
      
      <div class="repo-stats">
        <div class="stat-item" title="Stars">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          <span>${repo.stargazers_count}</span>
        </div>
        
        <div class="stat-item" title="Forks">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
          </svg>
          <span>${repo.forks_count}</span>
        </div>
      </div>
    </div>
    
    <div class="repo-footer">
      <span class="repo-date">Updated ${updatedDate}</span>
      <button class="view-readme-btn" onclick="openReadme('${repo.name}', '${repo.full_name}', '${repo.html_url}')">
        <span>View README</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 5l7 7-7 7"/>
        </svg>
      </button>
    </div>
  `;

  return card;
}

// Open README modal
async function openReadme(repoName, fullName, repoUrl) {
  modalTitle.textContent = repoName;
  modalGithubLink.href = repoUrl;
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  
  // Reset content
  modalContent.innerHTML = `
    <div class="loading-state">
      <div class="loading-spinner"></div>
      <p>Loading README...</p>
    </div>
  `;

  try {
    const response = await fetch(`https://api.github.com/repos/${fullName}/readme`);
    const data = await response.json();

    if (response.ok && data.content) {
      const content = atob(data.content.replace(/\n/g, ''));
      modalContent.innerHTML = marked.parse(content);
    } else {
      modalContent.innerHTML = `
        <div class="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          <p>No README available for this repository</p>
        </div>
      `;
    }
  } catch (error) {
    console.error('Error loading README:', error);
    modalContent.innerHTML = `
      <div class="error-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <p>Failed to load README</p>
      </div>
    `;
  }
}

// Close modal
function closeModal() {
  modal.style.display = 'none';
  document.body.style.overflow = 'auto';
}

// Close modal on escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.style.display === 'flex') {
    closeModal();
  }
});

// Load repositories when page loads
document.addEventListener('DOMContentLoaded', loadRepositories);
</script>

<style>
/* Modern Blog Section Styles */
.blog-section {
  padding: 4rem 0;
  max-width: 1200px;
  margin: 0 auto;
}

.blog-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 3rem;
  padding: 0 1rem;
}

.blog-title-wrapper {
  flex: 1;
}

.blog-title {
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #58a6ff 0%, #bd00ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 0.5rem 0;
}

.blog-subtitle {
  font-size: 1.125rem;
  color: var(--text-secondary);
  margin: 0;
}

.github-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  color: var(--text-primary);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.github-link:hover {
  background: var(--bg-card-hover);
  border-color: var(--accent-color);
  transform: translateY(-2px);
  box-shadow: 0 0 20px var(--accent-glow);
}

.github-icon {
  width: 20px;
  height: 20px;
}

.arrow-icon {
  width: 16px;
  height: 16px;
  transition: transform 0.3s ease;
}

.github-link:hover .arrow-icon {
  transform: translate(4px, -4px);
}

/* Repository Grid */
.repo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  padding: 0 1rem;
}

/* Repository Card */
.repo-card {
  background: var(--bg-card);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: fadeInUp 0.6s ease forwards;
  opacity: 0;
  transform: translateY(20px);
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.repo-card:hover {
  transform: translateY(-4px);
  background: var(--bg-card-hover);
  border-color: var(--accent-color);
  box-shadow: 0 8px 32px rgba(88, 166, 255, 0.15);
}

.repo-card-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.repo-icon-wrapper {
  width: 40px;
  height: 40px;
  background: rgba(88, 166, 255, 0.1);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.repo-icon {
  width: 24px;
  height: 24px;
  color: var(--accent-color);
}

.repo-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.repo-description {
  font-size: 0.9375rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
}

.repo-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.repo-language {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.language-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.repo-stats {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.stat-item svg {
  width: 16px;
  height: 16px;
}

.repo-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.repo-date {
  font-size: 0.8125rem;
  color: var(--text-secondary);
}

.view-readme-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--accent-color);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.view-readme-btn:hover {
  background: rgba(88, 166, 255, 0.1);
  border-color: var(--accent-color);
}

.view-readme-btn svg {
  width: 16px;
  height: 16px;
  transition: transform 0.3s ease;
}

.view-readme-btn:hover svg {
  transform: translateX(4px);
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 3rem;
  color: var(--text-secondary);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--border-color);
  border-top-color: var(--accent-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Error State */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 3rem;
  color: var(--text-secondary);
  text-align: center;
}

.error-icon {
  width: 48px;
  height: 48px;
  color: #f85149;
}

.retry-link {
  color: var(--accent-color);
  text-decoration: none;
  font-weight: 500;
}

.retry-link:hover {
  text-decoration: underline;
}

/* Modal Styles */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.modal-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-container {
  position: relative;
  background: var(--bg-dark);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  max-width: 900px;
  max-height: 85vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  animation: slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-card);
}

.modal-title-wrapper {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.modal-title-wrapper .repo-icon {
  width: 28px;
  height: 28px;
  color: var(--accent-color);
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.modal-close {
  width: 40px;
  height: 40px;
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.modal-close:hover {
  background: rgba(248, 81, 73, 0.1);
  border-color: #f85149;
  color: #f85149;
}

.modal-close svg {
  width: 20px;
  height: 20px;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 0;
}

.modal-content {
  padding: 2rem;
  color: var(--text-primary);
  line-height: 1.8;
}

.modal-content h1,
.modal-content h2,
.modal-content h3,
.modal-content h4 {
  color: var(--text-primary);
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.modal-content h1 {
  font-size: 2rem;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 0.5rem;
}

.modal-content h2 {
  font-size: 1.5rem;
}

.modal-content h3 {
  font-size: 1.25rem;
}

.modal-content p {
  margin-bottom: 1rem;
}

.modal-content code {
  background: var(--bg-card);
  padding: 0.2rem 0.4rem;
  border-radius: 6px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.875rem;
  color: var(--accent-color);
}

.modal-content pre {
  background: var(--bg-card);
  padding: 1.5rem;
  border-radius: 12px;
  overflow-x: auto;
  margin: 1.5rem 0;
  border: 1px solid var(--border-color);
}

.modal-content pre code {
  background: none;
  padding: 0;
  color: var(--text-primary);
}

.modal-content blockquote {
  border-left: 4px solid var(--accent-color);
  padding-left: 1rem;
  margin: 1.5rem 0;
  color: var(--text-secondary);
  font-style: italic;
}

.modal-content ul,
.modal-content ol {
  margin: 1rem 0;
  padding-left: 1.5rem;
}

.modal-content li {
  margin: 0.5rem 0;
}

.modal-content a {
  color: var(--accent-color);
  text-decoration: none;
}

.modal-content a:hover {
  text-decoration: underline;
}

.modal-content img {
  max-width: 100%;
  border-radius: 8px;
  margin: 1rem 0;
}

.modal-footer {
  padding: 1.5rem 2rem;
  border-top: 1px solid var(--border-color);
  background: var(--bg-card);
  display: flex;
  justify-content: flex-end;
}

.github-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: var(--accent-color);
  border: none;
  border-radius: 10px;
  color: #0d1117;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}

.github-btn:hover {
  background: #79c0ff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(88, 166, 255, 0.4);
}

.github-btn svg {
  width: 20px;
  height: 20px;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 3rem;
  color: var(--text-secondary);
  text-align: center;
}

.empty-state svg {
  width: 48px;
  height: 48px;
  opacity: 0.5;
}

/* Responsive Design */
@media (max-width: 768px) {
  .blog-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
  }
  
  .blog-title {
    font-size: 2rem;
  }
  
  .repo-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .modal {
    padding: 1rem;
  }
  
  .modal-container {
    max-height: 90vh;
  }
  
  .modal-header,
  .modal-footer {
    padding: 1rem 1.5rem;
  }
  
  .modal-content {
    padding: 1.5rem;
  }
}

/* Custom Scrollbar for Modal */
.modal-body::-webkit-scrollbar {
  width: 8px;
}

.modal-body::-webkit-scrollbar-track {
  background: transparent;
}

.modal-body::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 4px;
}

.modal-body::-webkit-scrollbar-thumb:hover {
  background: var(--accent-color);
}
</style>
