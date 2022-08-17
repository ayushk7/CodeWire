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
        backgroud: "#292c35", // index backgroud
        "box-bg": "#353944",
        "box-bg-dark": "#2a2c32",
        border: "#404658",
        "dot-line": "#404552",
        "icon-color": "#4c535f",
        primary: "#472ba2",
        "primary-light": "#5533c2",
        secondary: "#d1ec1a",
      },
    },
  },
  plugins: [],
};
