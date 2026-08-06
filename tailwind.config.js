/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./data/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#004790",
          container: "#1a5fb4",
          light: "#d6e3ff",
          dark: "#001b3e",
        },
        secondary: {
          DEFAULT: "#944a00",
          container: "#fc8f34",
          light: "#ffdcc5",
          dark: "#301400",
        },
        surface: {
          DEFAULT: "#f8f9fa",
          container: "#edeeef",
          high: "#e7e8e9",
          lowest: "#ffffff",
        },
      },
      fontFamily: {
        display: ["Montserrat", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1.25rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};
