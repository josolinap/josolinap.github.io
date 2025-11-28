---
layout: single
title: "Projects"
subtitle: "A showcase of my work and creative experiments"
permalink: "/projects/"
---

## Featured Projects

Here are some of my recent projects that I'm particularly proud of. Each project represents a unique challenge and learning experience.

{% assign featured_projects = site.projects | where: "featured", true %}
{% for project in featured_projects limit: 3 %}
### [{{ project.title }}]({{ project.url }})
{{ project.description }}

**Technologies:** {{ project.technologies | join: ", " }}
{% if project.project_url %}**Live Demo:** [{{ project.project_url }}]({{ project.project_url }}){% endif %}
{% if project.github_url %}**Source Code:** [{{ project.github_url }}]({{ project.github_url }}){% endif %}

---
{% endfor %}

## All Projects

{% assign sorted_projects = site.projects | sort: "date" | reverse %}
{% for project in sorted_projects %}
### [{{ project.title }}]({{ project.url }})
*{{ project.date | date: "%B %Y" }}*

{{ project.description }}

**Type:** {{ project.project_type }} | **Status:** {{ project.status }}
{% if project.technologies %}**Technologies:** {{ project.technologies | join: ", " }}{% endif %}

{% if project.project_url or project.github_url %}
**Links:**
{% if project.project_url %}[Live Demo]({{ project.project_url }}){% endif %}
{% if project.github_url %} • [Source Code]({{ project.github_url }}){% endif %}
{% endif %}

---
{% endfor %}

## Project Categories

- **Web Applications**: Full-stack applications with modern frameworks
- **Websites**: Responsive websites and landing pages
- **Design Systems**: Reusable component libraries and design tokens
- **Experiments**: Creative coding projects and prototypes

---

*Want to work together? [Get in touch!](/about/)*
