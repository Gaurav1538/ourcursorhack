import React, { useEffect } from 'react';

export default function EnvironmentInjector() {
  useEffect(() => {
    // Fonts and Icons
    if (!document.getElementById('ds-fonts')) {
      document.head.insertAdjacentHTML('beforeend', `
        <link id="ds-fonts" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@400;700;800&display=swap" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet">
      `);
    }

    // Leaflet assets
    if (!document.getElementById('leaflet-css')) {
      const leafletCss = document.createElement('link');
      leafletCss.id = 'leaflet-css'; leafletCss.rel = 'stylesheet'; leafletCss.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(leafletCss);
    }
    if (!document.getElementById('leaflet-js')) {
      const leafletJs = document.createElement('script');
      leafletJs.id = 'leaflet-js'; leafletJs.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      document.head.appendChild(leafletJs);
    }

    // Tailwind CDN (dev-friendly) and some theme tokens
    if (!document.getElementById('tailwind-cdn')) {
      const script = document.createElement('script');
      script.id = 'tailwind-cdn';
      script.src = 'https://cdn.tailwindcss.com?plugins=forms,container-queries';
      script.onload = () => {
        window.tailwind = window.tailwind || {};
        window.tailwind.config = window.tailwind.config || {
          theme: { extend: { colors: { primary: '#0f172a', 'primary-light': '#1e293b', error: '#e11d48' }, fontFamily: { headline: ['Manrope','sans-serif'], body: ['Inter','sans-serif'] } } }
        };
      };
      document.head.appendChild(script);
    }

    // Small global styles
    if (!document.getElementById('ds-global-styles')) {
      const styleEl = document.createElement('style');
      styleEl.id = 'ds-global-styles';
      styleEl.innerHTML = `
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; vertical-align: middle; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .leaflet-container { background: #0f172a !important; font-family: 'Inter', sans-serif; }
        .leaflet-control-attribution { display: none !important; }
      `;
      document.head.appendChild(styleEl);
    }
  }, []);

  return null;
}
