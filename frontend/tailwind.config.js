/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#006194",
        "primary-container": "#007bb9",
        "primary-fixed": "#cce5ff",
        "primary-fixed-dim": "#93ccff",
        "on-primary": "#ffffff",
        "on-primary-container": "#fdfcff",
        "secondary": "#565e74",
        "secondary-container": "#dae2fd",
        "secondary-fixed": "#dae2fd",
        "secondary-fixed-dim": "#bec6e0",
        "on-secondary": "#ffffff",
        "tertiary": "#006947",
        "tertiary-container": "#00855b",
        "tertiary-fixed": "#6ffbbe",
        "tertiary-fixed-dim": "#4edea3",
        "on-tertiary": "#ffffff",
        "surface": "#f8f9ff",
        "surface-bright": "#f8f9ff",
        "surface-dim": "#cbdbf5",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#eff4ff",
        "surface-container": "#e5eeff",
        "surface-container-high": "#dce9ff",
        "surface-container-highest": "#d3e4fe",
        "on-surface": "#0b1c30",
        "on-surface-variant": "#3f4850",
        "background": "#f8f9ff",
        "on-background": "#0b1c30",
        "outline": "#707881",
        "outline-variant": "#bfc7d2",
        "error": "#ba1a1a",
        "error-container": "#ffdad6",
        "on-error": "#ffffff"
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        headline: ["Plus Jakarta Sans", "sans-serif"]
      }
    },
  },
  plugins: [],
}
