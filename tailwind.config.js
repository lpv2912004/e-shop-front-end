/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js}",
    "./index.html",
    "./node_modules/tw-elements/js/**/*.js"
  ],
  plugins: [require("tw-elements/plugin.cjs")],
  darkMode: "class",

};
