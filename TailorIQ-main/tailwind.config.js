/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./client/index.html",
    "./client/src/**/*.{js,ts,jsx,tsx}",
    "./shared/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        brand: {
          purple: "#7C3AED",
          indigo: "#4F46E5",
          "indigo-light": "#818CF8",
          "purple-light": "#A78BFA",
          blue: "#3B82F6",
          cyan: "#06B6D4",
        },
        sidebar: {
          background: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-slow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
        "gradient-move": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        float: "float 6s ease-in-out infinite",
        "pulse-slow": "pulse-slow 3s ease-in-out infinite",
        "gradient-move": "gradient-move 15s ease infinite",
        shimmer: "shimmer 2s infinite",
      },
      backgroundImage: {
        "hero-pattern-light":
          "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath fill='%237c3aed' fill-opacity='.08' d='M0 0h1v100H0zM10 0h1v100h-1zM20 0h1v100h-1zM30 0h1v100h-1zM40 0h1v100h-1zM50 0h1v100h-1zM60 0h1v100h-1zM70 0h1v100h-1zM80 0h1v100h-1zM90 0h1v100h-1zM100 0h1v100h-1zM0 0h100v1H0zM0 10h100v1H0zM0 20h100v1H0zM0 30h100v1H0zM0 40h100v1H0zM0 50h100v1H0zM0 60h100v1H0zM0 70h100v1H0zM0 80h100v1H0zM0 90h100v1H0zM0 100h100v1H0z'/%3E%3C/g%3E%3C/svg%3E\")",
        "hero-pattern-dark":
          "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath fill='%237c3aed' fill-opacity='.15' d='M0 0h1v100H0zM10 0h1v100h-1zM20 0h1v100h-1zM30 0h1v100h-1zM40 0h1v100h-1zM50 0h1v100h-1zM60 0h1v100h-1zM70 0h1v100h-1zM80 0h1v100h-1zM90 0h1v100h-1zM100 0h1v100h-1zM0 0h100v1H0zM0 10h100v1H0zM0 20h100v1H0zM0 30h100v1H0zM0 40h100v1H0zM0 50h100v1H0zM0 60h100v1H0zM0 70h100v1H0zM0 80h100v1H0zM0 90h100v1H0zM0 100h100v1H0z'/%3E%3C/g%3E%3C/svg%3E\")",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
