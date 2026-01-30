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

<div class="hero-section" style="text-align: center; padding: 4rem 0; margin-bottom: 2rem;">
  <h1 style="font-size: 3.5rem; background: linear-gradient(to right, #58a6ff, #bd00ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 1rem;">
    Josolina's Code Garden
  </h1>
  <p style="font-size: 1.25rem; color: var(--text-secondary); max-width: 600px; margin: 0 auto;">
    Exploring the frontiers of web development, design, and creative coding.
  </p>
</div>

<div class="posts-header" style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem; margin-bottom: 2rem;">
  <h2 style="margin: 0; font-size: 1.5rem;">Latest Articles</h2>
  <span style="font-size: 0.875rem; color: var(--accent-color);">✨ Professional Insights</span>
</div>
