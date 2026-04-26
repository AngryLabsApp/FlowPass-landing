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
        epoch: ["Epoch", "Syne", "DM Sans", "sans-serif"],
        oktah: ["OktahNeue", "Inter", "DM Sans", "sans-serif"],
      },
      colors: {
        brand: {
          DEFAULT: "#01f59e",
          50: "#e6fff5",
          100: "#b3ffdf",
          200: "#66ffc4",
          300: "#1affa8",
          400: "#00f5a0",
          500: "#01f59e", // verde principal
          600: "#00c47e",
          700: "#00935e",
          800: "#006240",
          900: "#003120",
        },
        purple: {
          DEFAULT: "#531DD8",
          50: "#ede8fb",
          100: "#c9b8f4",
          200: "#a488ed",
          300: "#7f58e6",
          400: "#6a38df",
          500: "#531DD8", // morado principal
          600: "#4318b0",
          700: "#321388",
          800: "#220d60",
          900: "#110738",
        },
        blue: {
          DEFAULT: "#3168F4",
          50: "#eaf0fe",
          100: "#bdd0fb",
          200: "#90b0f8",
          300: "#6390f6",
          400: "#4a7cf5",
          500: "#3168F4", // azul adicional
          600: "#2754c6",
          700: "#1d3f98",
          800: "#132a6a",
          900: "#09153c",
        },
        dark: {
          100: "#13131a",
          200: "#0e0e14",
          300: "#09090f",
          400: "#050508",
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
      },
    },
  },
};

module.exports = config;
