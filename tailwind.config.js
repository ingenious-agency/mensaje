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
        "from-avatars-red-start",
        "to-avatars-red-end",
        "from-avatars-orange-start",
        "to-avatars-orange-end",
        "from-avatars-green-start",
        "to-avatars-green-end",
        "from-avatars-blue-start",
        "to-avatars-blue-end",
        "from-avatars-sky-blue-start",
        "to-avatars-sky-blue-end",
        "from-avatars-purple-start",
        "to-avatars-purple-end",
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
        avatars: {
          "red-end": "#FC556D",
          "red-start": "#FD8763",
          "orange-end": "#FFBB55",
          "orange-start": "#FD820B",
          "green-end": "#9EDB7D",
          "green-start": "#57CB69",
          "blue-end": "#81ADFF",
          "blue-start": "#6A6AFF",
          "sky-blue-end": "#72D3FA",
          "sky-blue-start": "#38A4EF",
          "purple-end": "#B745ED",
          "purple-start": "#DEA2F1",
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
    extend: {
      margin: ["first"],
      padding: ["first"],
    },
  },
  plugins: [],
}
