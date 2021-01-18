// tailwind.config.js
module.exports = {
  purge: {
    content: ["{app,pages}/**/*.{js,jsx,ts,tsx}"],
    options: {
      safelist: [
        "leading-relaxed",
        "text-blue-default",
        "hover:underline",
        "text-light",
        "mb-2",
        "text-base",
        "font-medium",
        "mb-1",
        "mt-6",
        "list-disc",
        "list-inside",
        "font-mono",
        "px-1",
        "text-sm",
      ],
    },
  },
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
        mono: ["IBM Plex Mono", "monospace"],
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
