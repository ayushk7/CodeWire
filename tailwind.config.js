// eslint-disable-next-line no-undef
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      title: ["Silkscreen", "cursive"],
      body: ["Anton", "sans-serif"],
    },
    extend: {
      colors: {
        backgroud: "#292C35", // index backgroud
        "box-bg": "#353944",
        "box-bg-dark": "#2A2C32",
        border: "#404658",
        "dot-line": "#404552",
        icon: "#4C535F", // icon color
        primary: "#472BA2",
        "primary-light": "#5533C2",
        secondary: "#d1ec1a",
      },
    },
  },
  plugins: [],
};
