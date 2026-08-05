// Entry point module for Vite bundling
import './data.js';
import './ui.js';
import './router.js';
import './app.js';
import imgUrl from './img.png';

// Dynamically bind hero image src via Vite asset import
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

console.log('🚀 BetMines Main Bundle Initialized Successfully with Dynamic Image Assets!');
