// Entry point module for Vite bundling
import './data.js';
import './ui.js';
import './router.js';
import './app.js';

// Dynamic image URL helper using Vite's native URL pattern
function getImageUrl(name) {
  // note that this does not include files in subdirectories
  return new URL(`./dir/${name}.png`, import.meta.url).href;
}

if (typeof window !== 'undefined') {
  window.getImageUrl = getImageUrl;
}

if (typeof document !== 'undefined') {
  const applyHeroImg = () => {
    const heroImg = document.getElementById('hero-img');
    if (heroImg) {
      heroImg.src = getImageUrl('hero_banner');
    }
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyHeroImg);
  } else {
    applyHeroImg();
  }
}

console.log('🚀 BetMines Main Bundle Initialized Successfully with getImageUrl Dynamic Helper!');
