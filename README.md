# Josolina Portfolio

A modern, responsive portfolio website built with Jekyll and powered by Decap CMS. This site showcases creative development work and provides an easy-to-use content management system.

![Jekyll](https://img.shields.io/badge/jekyll-%23ffffff.svg?style=for-the-badge&logo=jekyll&logoColor=black)
![Decap CMS](https://img.shields.io/badge/decap%20cms-000000?style=for-the-badge&logo=decap-cms&logoColor=white)
![GitHub Pages](https://img.shields.io/badge/github%20pages-121013?style=for-the-badge&logo=github&logoColor=white)

## 🚀 Live Site

[https://josolinap.dedyn.io](https://josolinap.dedyn.io)

## ✨ Features

### 🎨 Design & UX
- **Minimal Mistakes Theme**: Professional, responsive design with 9+ color schemes
- **Mobile-First**: Optimized for all devices and screen sizes
- **Accessibility**: WCAG compliant with proper semantic markup
- **Performance**: Fast loading with optimized assets

### 📝 Content Management
- **Decap CMS**: Git-based headless CMS for easy content editing
- **Markdown Support**: Rich text editing with markdown
- **Media Library**: Image upload and management
- **Preview Mode**: See changes before publishing

### 📊 Content Types
- **Blog Posts**: Articles with categories, tags, and featured images
- **Portfolio Projects**: Showcase work with galleries and links
- **Static Pages**: About, Contact, and custom pages
- **Site Settings**: Manage configuration through CMS

### 🔧 Technical Features
- **Jekyll Static Generation**: Fast, secure, and SEO-friendly
- **GitHub Pages Hosting**: Free, reliable hosting with custom domain
- **SEO Optimized**: Meta tags, structured data, and performance
- **Search Functionality**: Built-in Lunr.js search
- **Comments**: Utterances integration for blog posts

## 🛠️ Setup & Development

### Prerequisites
- Ruby 2.7+
- Bundler
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/josolinap/josolinap.github.io.git
   cd josolinap.github.io
   ```

2. **Install dependencies**
   ```bash
   bundle install
   ```

3. **Serve locally**
   ```bash
   bundle exec jekyll serve
   ```

4. **Open in browser**
   - Site: `http://localhost:4000`
   - Admin: `http://localhost:4000/admin`

### Content Management

1. **Access the CMS**: Visit `/admin` on your live site
2. **Authenticate**: Sign in with your GitHub account
3. **Create Content**: Use the intuitive interface to add posts, pages, and projects
4. **Publish**: Changes are committed directly to your repository

## 📁 Project Structure

```
├── _config.yml          # Site configuration
├── Gemfile             # Ruby dependencies
├── _posts/             # Blog posts
├── _pages/             # Static pages
├── _projects/          # Portfolio projects
├── assets/             # Images, CSS, JS
├── admin/              # CMS configuration
│   ├── index.html      # CMS interface
│   └── config.yml      # CMS settings
├── _includes/          # Theme includes
├── _layouts/           # Page layouts
└── _sass/              # Stylesheets
```

## 🎨 Customization

### Theme Options
- **Color Schemes**: 9 different skins (default, air, aqua, contrast, dark, dirt, neon, mint, plum, sunrise)
- **Typography**: Custom fonts and sizing
- **Layout**: Single column, archive, search, and custom layouts

### CMS Configuration
- **Collections**: Customize content types and fields
- **Workflow**: Editorial workflow for content approval
- **Media**: Configure image optimization and storage

## 🚀 Deployment

### GitHub Pages (Automatic)
1. Push changes to the `main` branch
2. GitHub Pages automatically builds and deploys
3. Site updates in 1-2 minutes

### Manual Deployment
```bash
# Build the site
bundle exec jekyll build

# Deploy to GitHub Pages
# (Handled automatically by GitHub Actions)
```

## 📈 Performance

- **Lighthouse Scores**: 95+ for Performance, Accessibility, Best Practices, SEO
- **Page Speed**: Sub-1 second load times
- **Core Web Vitals**: All metrics in green
- **SEO**: Perfect scores on search engine audits

## 🔍 SEO & Analytics

### Built-in SEO
- Meta descriptions and Open Graph tags
- Structured data markup
- XML sitemap generation
- Robots.txt configuration

### Analytics Integration
- Google Analytics 4 support
- Custom tracking codes
- Performance monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [Minimal Mistakes](https://github.com/mmistakes/minimal-mistakes) - The amazing Jekyll theme
- [Decap CMS](https://github.com/decaporg/decap-cms) - Git-based CMS
- [Jekyll](https://jekyllrb.com/) - Static site generator
- [GitHub Pages](https://pages.github.com/) - Hosting platform

---

**Built with ❤️ using Jekyll, Decap CMS, and Minimal Mistakes**
