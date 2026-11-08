# ANJALI JEWELS — Netlify Deployment Guide

This project is fully configured and ready for 1-click deployment on **Netlify**.

---

## ⚡ Method 1: Git Integration (Recommended for Continuous Deployment)

1. Push this project repository to **GitHub**, **GitLab**, or **Bitbucket**.
2. Log in to your [Netlify Dashboard](https://app.netlify.com/).
3. Click **"Add new site"** → **"Import an existing project"**.
4. Select your Git provider and choose the **ANJALI JEWELS** repository.
5. Netlify will automatically detect the settings from `netlify.toml`:
   - **Base directory:** *(Leave blank)*
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Functions directory:** `netlify/functions`
6. Click **"Deploy site"**.
7. In ~60 seconds, your luxury boutique website will be live at `your-site-name.netlify.app` with free SSL!

---

## 🚀 Method 2: Netlify CLI

If you have the Netlify CLI installed on your computer:

```bash
# 1. Install Netlify CLI globally (if not already installed)
npm install -g netlify-cli

# 2. Login to your Netlify account
netlify login

# 3. Build the production bundle
npm run build

# 4. Deploy to production
netlify deploy --prod --dir=dist
```

---

## 📂 Method 3: Drag & Drop (Fastest for Instant Preview)

1. Run the build command locally:
   ```bash
   npm run build
   ```
2. Open [app.netlify.com/drop](https://app.netlify.com/drop) in your browser.
3. Drag and drop the generated `dist` folder into the Netlify browser window.
4. Your website will be live in seconds!

---

## 🛠 Pre-Configured Files & Optimizations Included

- **`netlify.toml`**: Configures the build pipeline, Node 20 runtime, security headers (`X-Frame-Options`, `nosniff`), and static asset caching.
- **`public/_redirects`**: Single Page Application (SPA) routing rule (`/* /index.html 200`) so category links and page reloads work seamlessly without 404 errors.
- **`netlify/functions/api.ts`**: Serverless function handler for `/api/products`, `/api/orders`, `/api/settings`, and `/api/admin/login`.
- **Offline / Static Resilience**: The frontend automatically bundles the complete 36-piece catalogue and falls back to client storage if APIs are unreachable, ensuring 100% uptime on Netlify under any hosting tier.
- **WhatsApp Direct Ordering**: Fully client-side formatted with all product codes, prices, customer delivery addresses, and boutique contact (`+91 9319862576`).

---

## 🌐 Custom Domain Setup on Netlify

1. In your Netlify site dashboard, navigate to **Site configuration** → **Domain management**.
2. Click **"Add a domain"** and enter your custom domain (e.g. `anjalijewels.com`).
3. Point your domain's DNS records:
   - **Apex domain (`@`):** `75.2.60.5` (Netlify load balancer IP)
   - **Subdomain (`www`):** `your-site-name.netlify.app` (CNAME)
4. Netlify will automatically provision a free Let's Encrypt SSL certificate within a few minutes.
