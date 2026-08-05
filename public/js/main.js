// Entry point module for Vite bundling
import './data.js';
import './ui.js';
import './router.js';
import './app.js';

// Dynamic asset resolution using Vite's native URL pattern
const imgUrl = new URL('./img.png', import.meta.url).href;

if (typeof document !== 'undefined') {
  const applyHeroImg = () => {
    const heroImg = document.getElementById('hero-img');
    if (heroImg && imgUrl) {
      heroImg.src = imgUrl;
    }
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyHeroImg);
  } else {
    applyHeroImg();
  }
}

console.log('🚀 BetMines Main Bundle Initialized Successfully with Native Dynamic URL Assets!');
