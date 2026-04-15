const fs = require("fs-extra");
const path = require("path");
const { minify: terserMinify } = require("terser");
const CleanCSS = require("clean-css");

async function build() {
  try {
    console.log("🧹 Cleaning dist folder...");
    await fs.emptyDir("dist");

    console.log("📁 Copying static assets...");

    // List of files and folders to copy as-is
    const itemsToCopy = [
      "pictures",
      "fonts",
      "favicon_io",
      "android-chrome-192x192.png",
      "android-chrome-512x512.png",
      "apple-touch-icon.png",
      "favicon-16x16.png",
      "favicon-32x32.png",
      "favicon.ico",
      "site.webmanifest",
      "CNAME",
      "sitemap.xml",
    ];

    for (const item of itemsToCopy) {
      if (await fs.pathExists(item)) {
        await fs.copy(item, path.join("dist", item));
      }
    }

    // Process index.html: minify inline CSS
    console.log("🎨 Minifying inline CSS in index.html...");
    let htmlContent = await fs.readFile("index.html", "utf8");
    htmlContent = htmlContent.replace(
      /<style>([\s\S]*?)<\/style>/g,
      (match, css) => {
        const minified = new CleanCSS({ level: 2 }).minify(css.trim());
        return `<style>${minified.styles}</style>`;
      }
    );
    await fs.writeFile("dist/index.html", htmlContent);

    console.log("🎨 Minifying CSS...");
    await fs.ensureDir("dist/css");
    if (await fs.pathExists("css/style.css")) {
      const cssCode = await fs.readFile("css/style.css", "utf8");
      const cssMinified = new CleanCSS().minify(cssCode);
      await fs.writeFile("dist/css/style.css", cssMinified.styles);
    }

    console.log("📜 Minifying JS...");
    await fs.ensureDir("dist/js");
    const jsFiles = ["app.js", "translations.js"];
    for (const file of jsFiles) {
      const jsPath = `js/${file}`;
      if (await fs.pathExists(jsPath)) {
        const jsCode = await fs.readFile(jsPath, "utf8");
        const jsMinified = await terserMinify(jsCode);
        await fs.writeFile(`dist/js/${file}`, jsMinified.code);
      }
    }

    console.log('✅ Build completed successfully in "dist/" folder!');
  } catch (error) {
    console.error("❌ Build failed:", error);
    process.exit(1);
  }
}

build();
