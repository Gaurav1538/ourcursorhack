/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "outline": "#767683",
        "on-primary-fixed-variant": "#3a4859",
        "surface-container-low": "#f3f4f5",
        "error": "#ba1a1a",
        "surface-container-highest": "#e1e3e4",
        "secondary-container": "#c2dcff",
        "on-tertiary-fixed": "#002108",
        "tertiary-fixed-dim": "#3ce36a",
        "primary-fixed": "#d6e4f9",
        "surface-bright": "#f8f9fa",
        "tertiary-fixed": "#69ff87",
        "on-error": "#ffffff",
        "on-surface": "#191c1d",
        "background": "#f8f9fa",
        "tertiary-container": "#003912",
        "inverse-surface": "#2e3132",
        "primary": "#0e1c2b",
        "on-error-container": "#93000a",
        "on-secondary": "#ffffff",
        "primary-fixed-dim": "#bac8dc",
        "on-secondary-container": "#48617e",
        "on-secondary-fixed-variant": "#2f4865",
        "surface-tint": "#525f71",
        "primary-container": "#233141",
        "surface-dim": "#d9dadb",
        "secondary-fixed": "#d1e4ff",
        "on-tertiary-fixed-variant": "#00531e",
        "surface-container": "#edeeef",
        "surface-container-lowest": "#ffffff",
        "on-tertiary-container": "#00b048",
        "inverse-primary": "#bac8dc",
        "outline-variant": "#c6c5d4",
        "on-surface-variant": "#454652",
        "inverse-on-surface": "#f0f1f2",
        "on-primary-container": "#8b99ac",
        "on-secondary-fixed": "#001d36",
        "on-background": "#191c1d",
        "surface-variant": "#e1e3e4",
        "error-container": "#ffdad6",
        "surface": "#f8f9fa",
        "surface-container-high": "#e7e8e9",
        "secondary-fixed-dim": "#afc9ea",
        "secondary": "#47607e",
        "on-tertiary": "#ffffff",
        "on-primary-fixed": "#0f1c2c",
        "on-primary": "#ffffff",
        "tertiary": "#002108"
      },
      fontFamily: {
        "headline": ["Manrope", "sans-serif"],
        "body": ["Inter", "sans-serif"],
        "label": ["Inter", "sans-serif"]
      },
      borderRadius: { 
        "DEFAULT": "0.125rem", 
        "lg": "0.25rem", 
        "xl": "0.5rem", 
        "full": "0.75rem" 
      }
    }
  },
  plugins: [],
}
