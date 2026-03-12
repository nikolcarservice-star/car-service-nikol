/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["system-ui", "ui-sans-serif", "sans-serif"]
      },
      boxShadow: {
        glow: "0 0 40px rgba(249, 115, 22, 0.25)",
        // CRM 1.1: мягкие тени для глубины и glassmorphism
        "crm-card": "0 4px 24px -4px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.04)",
        "crm-card-hover": "0 8px 32px -8px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.06)",
        "crm-btn": "0 2px 8px -2px rgba(249, 115, 22, 0.35)"
      },
      colors: {
        // CRM 1.1 Deep Dark: фон, поверхности, акцент, текст
        crm: {
          bg: "#1A1D21",
          surface: "#24292E",
          surfaceHover: "#2d333b",
          accent: "#F97316",
          accentHover: "#ea580c",
          text: "#E2E8F0",
          textMuted: "#94A3B8",
          border: "rgba(255,255,255,0.08)",
          glass: "rgba(36, 41, 46, 0.85)"
        }
      },
      borderRadius: {
        crm: "10px",
        "crm-lg": "14px"
      },
      backdropBlur: {
        crm: "12px"
      }
    }
  },
  plugins: []
};

