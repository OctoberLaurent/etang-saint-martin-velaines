const fs = require('fs-extra');
const path = require('path');
const { minify: terserMinify } = require('terser');
const CleanCSS = require('clean-css');

async function build() {
    try {
        console.log('🧹 Nettoyage du dossier dist...');
        await fs.emptyDir('dist');

        console.log('📁 Copie des fichiers statiques (images, html, etc.)...');

        // Liste des fichiers et dossiers à copier tels quels
        const itemsToCopy = [
            'index.html',
            'pictures',
            'fonts',
            'favicon_io',
            'android-chrome-192x192.png',
            'android-chrome-512x512.png',
            'apple-touch-icon.png',
            'favicon-16x16.png',
            'favicon-32x32.png',
            'favicon.ico',
            'site.webmanifest',
            'CNAME',
            'sitemap.xml'
        ];

        for (const item of itemsToCopy) {
            if (await fs.pathExists(item)) {
                await fs.copy(item, path.join('dist', item));
            }
        }

        console.log('🎨 Minification du CSS...');
        await fs.ensureDir('dist/css');
        if (await fs.pathExists('css/style.css')) {
            const cssCode = await fs.readFile('css/style.css', 'utf8');
            const cssMinified = new CleanCSS().minify(cssCode);
            await fs.writeFile('dist/css/style.css', cssMinified.styles);
        }

        console.log('📜 Minification du JS...');
        await fs.ensureDir('dist/js');
        const jsFiles = ['app.js', 'translations.js'];
        for (const file of jsFiles) {
            const jsPath = `js/${file}`;
            if (await fs.pathExists(jsPath)) {
                const jsCode = await fs.readFile(jsPath, 'utf8');
                const jsMinified = await terserMinify(jsCode);
                await fs.writeFile(`dist/js/${file}`, jsMinified.code);
            }
        }

        console.log('✅ Build terminé avec succès dans le dossier "dist/" ! Vous pouvez tester ce dossier.');
    } catch (error) {
        console.error('❌ Erreur lors du build :', error);
        process.exit(1);
    }
}

build();
