# Minification System for L'Étang Saint-Martin

To make the website faster and more optimized (especially for SEO and user experience), a minification system has been implemented.

This system takes care of **compressing the CSS and JavaScript code** without you needing to work on unreadable files.

## 🛠️ How it works

You continue working **exactly as before** on the files in the `css/` and `js/` folders.

When the "build" script is run, a `dist/` (for *Distribution*) folder is generated. This folder contains **the final, optimized version** of your site:

1. **Images and fonts** are copied as they are.
2. The **`index.html`** file is copied as it is.
3. The **CSS** (`css/style.css`) is minified into `dist/css/style.css`.
4. The **JavaScript** (`js/app.js` and `translations.js`) is minified into `dist/js/`.

Since the `index.html` files natively point to `css/style.css` and `js/app.js`, they perfectly integrate with the minified files generated in this `dist/` folder without having to change the path names!

---

## 🚀 How to use it locally

If you wish to test the minified version on your machine (optional, as it is automatic on GitHub):

1. Open your terminal in the project folder.
2. Run the following command:
   ```bash
   npm run build
   ```
3. This will create (or update) a `dist/` folder at the root of your project.
4. You can then open the `dist/index.html` file or share the `dist/` folder via Ngrok/Live Server. 
   *(Note: The `dist/` folder is not synced to GitHub to avoid unnecessarily duplicating the code files.)*

---

## 🌐 Automatic Deployment on GitHub Pages

**The magic happens here!** ✨

A workflow file (`.github/workflows/deploy.yml`) has been added.
It tells GitHub to do the minification work by itself.

**Every time you do a `git push`** (send updates to GitHub):
1. GitHub's servers retrieve your clean, readable code.
2. They run the `npm run build` command in the background.
3. They deploy the contents of the `dist/` folder to the public part of **GitHub Pages**.

**Simply put, you have absolutely nothing to do.** 
- Your source files remain easily readable on your PC.
- Your visitors browse an ultra-fast and compressed version.

---

## 📦 Tools used
- **Terser**: The industry standard for JavaScript minification.
- **Clean-CSS**: A very fast minifier for CSS.
- **fs-extra**: A JavaScript utility to easily copy entire folders (like images).

Everything is controlled from the central `build.js` file, which you can modify later if you add other folders to your project (e.g., a `videos` folder).
