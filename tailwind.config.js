// eslint-disable-next-line no-undef
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      title: ["Silkscreen", "cursive"],
      body: ["Rubik", "sans-serif"],
    },
    boxShadow: {
      sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
      DEFAULT: "2px 3px 1px 0px rgba(0, 0, 0, 0.4)",
      md: "4px 6px 2px 0px rgb(0 0 0 / 0.2)",
      lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
      xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
      "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
      inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
      none: "none",
    },
    extend: {
      colors: {
        backgroud: "#292C35", // index backgroud
        "box-bg": "#353944",
        "box-bg-dark": "#2A2C32",
        border: "#394159",
        "border-dark": "#222222",
        "dot-line": "#404552",
        icon: "#4C535F", // icon color
        body: "#7f7f7f",
        primary: "#5F22C4",
        "primary-light": "#5533C2",
        secondary: "#d1ec1a",
      },
    },
  },
  plugins: [],
};
