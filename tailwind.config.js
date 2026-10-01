/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        "custom-heavy":
          "-1px 6px 114px 17px rgba(36, 70, 80, 80)",
        "custom-low":
          "0px -2px 136px 7px rgba(52, 56, 86, 16)",
      },
      backgroundImage: {
        "hero-photo":
          "url('/images/photo-6.jpg')",
        "two-men": "url('/images/photo-2.jpg')",
        documentation:
          "url('./images/document.jpg')",
        operate: "./images/operation.jpg",

        lado: "./images/lado-surgery.jpg",
        whatsapp: "./images/whatsapp.png",
        german: "./images/photo-3.jpg",
        germany: "./images/germany.png",
        russia: "./images/russia.png",
        logo: "./images/lg-5.png",
      },

      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        Roboto: ["Roboto-Mono", "monospace;"],
        montserrat: ["Montserrat", "sans-serif"],
        bebas: ["Bebas Neue", "sans-serif"],
        geo: ["Noto Sans Georgian", "sans-serif"],
      },
    },
  },
  plugins: [],
};
