# Pixolai 🛠️

A free, static, AI-powered toolkit for developers and creators — hosted on GitHub Pages.

**Live site:** https://pixolai.com  
**Stack:** Pure HTML · CSS · Vanilla JS — no frameworks, no build step.

---

## 📁 Folder Structure

```
/index.html                   ← Homepage
/404.html                     ← Custom 404 page
/robots.txt                   ← SEO: search engine crawl rules
/sitemap.xml                  ← SEO: page index for search engines
/tools/
  index.html                  ← All tools listing
  json-formatter.html         ← JSON Formatter & Validator
  base64-encoder.html         ← Base64 Encoder / Decoder
  timestamp-converter.html    ← Unix Timestamp Converter
/blog/
  index.html                  ← Blog listing page
  blog-template.html          ← Copy this to create a new post
  sample-post.html            ← Example blog post
/pages/
  contact.html                ← Contact form
  privacy.html                ← Privacy policy
/assets/
  css/style.css               ← All styles (CSS variables, dark mode, responsive)
  js/components.js            ← Header & footer injection + dark mode toggle
  js/main.js                  ← All tool logic (JSON, Base64, Timestamp)
  images/logo.svg             ← Logo (swap for logo.png if preferred)
```

---

## ✨ How to Add a New Tool

1. **Copy** `/tools/json-formatter.html` → `/tools/my-new-tool.html`
2. **Update** the `<title>`, meta description, canonical URL, and structured data
3. **Change** the IDs of your `<textarea>` and `<pre>` elements (e.g. `my-input`, `my-output`)
4. **Add** an `initMyTool()` function in `/assets/js/main.js` following the existing pattern
5. **Call** `initMyTool()` inside the `DOMContentLoaded` block in `main.js`
6. **Add** a card in `/tools/index.html` and on the homepage

---

## ✍️ How to Add a New Blog Post

1. **Copy** `/blog/blog-template.html` → `/blog/my-post-slug.html`
2. **Update** the `<title>`, meta description, canonical URL, and JSON-LD structured data
3. **Fill in** the post heading, date, tag, and article content
4. **Add** a `<article class="blog-card">` entry in `/blog/index.html`
5. Optionally feature it in the blog preview section on `index.html`

---

## 🌙 Dark Mode

Dark mode is toggled by the moon/sun button in the header and persists via `localStorage`.  
The key is `pixolai-theme` (value: `"dark"` or `"light"`).  
CSS variables are defined in `:root` and overridden in `[data-theme="dark"]` — easy to customise.

---

## 💰 Google AdSense Setup

1. Sign up at https://adsense.google.com and get approved
2. Replace `ca-pub-XXXXXXXXXXXXXXXX` with your Publisher ID in `index.html`
3. Uncomment the AdSense `<script>` and `<ins>` ad unit blocks
4. Add your ad unit slots to tool pages as needed

---

## 🚀 Deploying to GitHub Pages

```bash
git init
git add .
git commit -m "Initial Pixolai deploy"
git remote add origin https://github.com/YOUR_USERNAME/pixolai.git
git push -u origin main
```

Then in your GitHub repo: **Settings → Pages → Source: main branch → / (root)**

For a custom domain, add a `CNAME` file containing your domain (e.g. `pixolai.com`).

---

## 🎨 Customising the Design

All design tokens live as CSS variables in `:root` inside `style.css`.  
Change colours, fonts, border-radius values there and they cascade everywhere automatically.

| Variable | Purpose |
|---|---|
| `--accent` | Primary brand colour (teal) |
| `--bg` | Page background |
| `--ink` | Main text colour |
| `--font-display` | Heading font |
| `--font-body` | Body/UI font |

---

MIT License · Built with ❤️ by the Pixolai team
