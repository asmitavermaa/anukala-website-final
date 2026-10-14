// GitHub Pages helpers, run after `vite build`:
//  - 404.html is a copy of index.html so links like /collections/paintings still open the app
//  - .nojekyll stops GitHub from running Jekyll over the files
import { copyFileSync, writeFileSync } from 'node:fs';
copyFileSync('dist/index.html', 'dist/404.html');
writeFileSync('dist/.nojekyll', '');
console.log('postbuild: wrote dist/404.html and dist/.nojekyll');
