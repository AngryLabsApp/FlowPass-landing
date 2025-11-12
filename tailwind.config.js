const config = {
  content: [
    "./src/**/*.{html,js,svelte,ts}",
    "./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}",
  ],
  plugins: [require("flowbite/plugin")],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        jakarta: ['"Plus Jakarta Sans"', "sans-serif"],
      },
      colors: {
        brand: {
          DEFAULT: "#87FF65", // Color principal FlowPass
          50: "#F2FFE9",
          100: "#E4FFD3",
          200: "#C2FFA3",
          300: "#A0FF78",
          400: "#8AFF5C",
          500: "#87FF65",
          600: "#6CCF50",
          700: "#54A63D",
          800: "#3C7C2B",
          900: "#244D1A",
        },
        // flowbite-svelte
        secondary: {
          50: "#ffd9e0",
          100: "#ffd9e0",
          200: "#ffb3c0",
          300: "#ff8ca0",
          400: "#f95c7e",
          500: "#ee4266", // principal
          600: "#d3365a",
          700: "#b32d4e",
          800: "#912541", // color para botón sólido
          900: "#661930",
        },
        // Whites
        light: {
          50: "#FFFFFF",
          100: "#FAFAFA",
          200: "#F5F5F5",
          300: "#EFEFEF",
        },

        // Neutral greys
        neutral: {
          50: "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          300: "#CBD5E1",
          400: "#94A3B8",
          500: "#64748B",
          600: "#475569",
          700: "#334155",
          800: "#1E293B",
          900: "#0F172A",
        },

        // Dark palette
        dark: {
          100: "#1A1A1A",
          200: "#141414",
          300: "#0D0D0D",
          400: "#000000",
        },
      },
    },
  },
};

module.exports = config;
