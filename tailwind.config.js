// tailwind.config.js
module.exports = {
  purge: ["{app,pages}/**/*.{js,jsx,ts,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        gray: {
          700: "#999999",
          default: "#D9D9D9",
          350: "#F2F2F2",
          300: "#F4F4F5",
        },
        blue: {
          default: "#108CFF",
        },
      },
      fontFamily: {
        sans: ["Montserrat", "sans-serif"],
      },
      fontSize: {
        xss: ["0.625rem", "0.875rem"],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
