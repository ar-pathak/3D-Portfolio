// Optimization script for the build process

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

console.log('🚀 Starting optimization process...');

// Run the build with profiling enabled
console.log('📦 Building production bundle with profiling...');
execSync('npm run build -- --profile', { stdio: 'inherit' });

// Check if the dist directory exists
const distDir = path.join(rootDir, 'dist');
if (!fs.existsSync(distDir)) {
  console.error('❌ Build failed: dist directory not found');
  process.exit(1);
}

// Apply post-build optimizations
console.log('⚡ Applying post-build optimizations...');

// Optimization 1: Generate size report
console.log('📊 Generating bundle size report...');
const assets = fs.readdirSync(path.join(distDir, 'assets'));
const totalSize = assets.reduce((sum, file) => {
  const filePath = path.join(distDir, 'assets', file);
  const stats = fs.statSync(filePath);
  return sum + stats.size;
}, 0);

console.log(`Total assets size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);

// List largest assets
const assetSizes = assets.map(file => {
  const filePath = path.join(distDir, 'assets', file);
  const stats = fs.statSync(filePath);
  return { file, size: stats.size };
});

assetSizes.sort((a, b) => b.size - a.size);
console.log('Largest assets:');
assetSizes.slice(0, 5).forEach(({ file, size }) => {
  console.log(`- ${file}: ${(size / 1024).toFixed(2)} KB`);
});

// Optimization 2: Add preload links to index.html for critical assets
console.log('🔗 Adding preload links for critical assets...');
const indexPath = path.join(distDir, 'index.html');
let indexHtml = fs.readFileSync(indexPath, 'utf-8');

// Find CSS and JS assets
const cssAssets = assets.filter(file => file.endsWith('.css'));
const jsAssets = assets.filter(file => file.endsWith('.js') && file.includes('index'));

// Add preload links
const preloadLinks = [
  ...cssAssets.map(file => `<link rel="preload" href="/assets/${file}" as="style">`),
  ...jsAssets.map(file => `<link rel="preload" href="/assets/${file}" as="script">`)
].join('\n    ');

// Add hints for browser
const hints = [
  '<meta http-equiv="X-DNS-Prefetch-Control" content="on">',
  '<link rel="dns-prefetch" href="//fonts.googleapis.com">',
  '<link rel="preconnect" href="//fonts.googleapis.com" crossorigin>',
  '<meta name="theme-color" content="#000000">'
].join('\n    ');

// Insert preload links and hints in the head
indexHtml = indexHtml.replace('</head>', `    ${hints}\n    ${preloadLinks}\n  </head>`);

// Add script for better page load performance
const perfScript = `
  <script>
    // Performance optimization
    window.addEventListener('load', () => {
      // Defer non-critical resources
      setTimeout(() => {
        const deferredScripts = document.querySelectorAll('script[defer-load]');
        deferredScripts.forEach(script => {
          const newScript = document.createElement('script');
          [...script.attributes].forEach(attr => {
            if (attr.name !== 'defer-load') {
              newScript.setAttribute(attr.name, attr.value);
            }
          });
          newScript.innerHTML = script.innerHTML;
          script.parentNode.replaceChild(newScript, script);
        });
      }, 1000);
    });
  </script>
`;

// Add performance script before body closing tag
indexHtml = indexHtml.replace('</body>', `  ${perfScript}\n  </body>`);

// Write updated index.html
fs.writeFileSync(indexPath, indexHtml);

console.log('✅ Build optimization completed successfully!');
console.log('🌐 Your optimized portfolio is ready to deploy.'); 