# Système de Minification pour l'Étang Saint-Martin

Pour rendre le site plus rapide et optimisé (particulièrement pour le SEO naturel et l'expérience utilisateur), un système de minification a été mis en place.

Ce système s'occupe de **compresser le code CSS et JavaScript** sans que vous n'ayez besoin de travailler sur des fichiers illisibles.

## 🛠️ Comment ça fonctionne ?

Vous continuez de travailler **exactement comme avant** sur les fichiers dans les dossiers `css/` et `js/`.

Lorsqu'on lance le script de "build" (construction), un dossier `dist/` (pour *Distribution*) est généré. Ce dossier contient **la version finale et optimisée** de votre site :

1. Les **images et les polices** sont copiées telles quelles.
2. Le fichier **`index.html`** est copié tel quel.
3. Le **CSS** (`css/style.css`) est minifié dans `dist/css/style.css`.
4. Le **JavaScript** (`js/app.js` et `translations.js`) est minifié dans `dist/js/`.

Les fichiers `index.html` pointant nativement vers `css/style.css` et `js/app.js`, ils s'intègrent parfaitement aux fichiers minifiés générés dans ce dossier `dist/` sans avoir à changer les noms des chemins !

---

## 🚀 Comment l'utiliser en local ?

Si vous souhaitez tester la version minifiée sur votre machine (optionnel, car c'est automatique sur GitHub) :

1. Ouvrez votre terminal dans le dossier du projet.
2. Lancez la commande suivante :
   ```bash
   npm run build
   ```
3. Cela va créer (ou mettre à jour) un dossier `dist/` à la racine de votre projet.
4. Vous pouvez ensuite ouvrir le fichier `dist/index.html` ou partager le dossier `dist/` via Ngrok/Live Server. 
   *(Note: Le dossier `dist/` n'est pas synchronisé sur Github pour éviter de dupliquer inutilement les fichiers de code.)*

---

## 🌐 Déploiement automatique sur GitHub Pages

**La magie opère ici !** ✨

Un fichier de workflow (`.github/workflows/deploy.yml`) a été ajouté.
Il dit à GitHub de faire le travail de minification tout seul.

**À chaque fois que vous faites un `git push`** (que vous envoyez des mises à jour sur GitHub) :
1. Les serveurs de GitHub récupèrent votre code propre et lisible.
2. Ils lancent la commande `npm run build` en arrière-plan.
3. Ils déploient le contenu du dossier `dist/` sur la partie publique de **GitHub Pages**.

**En clair, vous n'avez absolument rien à faire.** 
- Vos fichiers sources restent bien lisibles sur votre PC.
- Vos visiteurs consultent une version ultra rapide et compressée.

---

## 📦 Les outils utilisés
- **Terser** : Le standard de l'industrie pour la minification du JavaScript.
- **Clean-CSS** : Un minificateur très rapide pour le CSS.
- **fs-extra** : Un utilitaire JavaScript pour copier facilement des dossiers entiers (comme les images).

Tout est piloté depuis le fichier central `build.js` que vous pourrez modifier par la suite si vous ajoutez d'autres dossiers à votre projet (ex: dossier `videos`).
