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
          default: "#00D48C", // Color principal FlowPass
          50: "#E6FFF5",
          100: "#CCFFE9",
          200: "#99FFD4",
          300: "#66FFBE",
          400: "#33FFA9",
          500: "#00D48C", // Main brand green
          600: "#00B074",
          700: "#009F6A", // Darker green for hover
          800: "#007A52",
          900: "#004C32",
        },
        // flowbite-svelte
        primary: {
          50: "#FFF5F2",
          100: "#FFF1EE",
          200: "#FFE4DE",
          300: "#FFD5CC",
          400: "#FFBCAD",
          500: "#FE795D",
          600: "#EF562F",
          700: "#EB4F27",
          800: "#CC4522",
          900: "#A5371B",
        },
      },
     
    },
  },
};

module.exports = config;
