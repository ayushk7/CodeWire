const express = require("express");
const route = express.Router();
const controller = require("../controller/saving_budget_controller");

const getTitle = function (title, name) {
  return `${title + name}`;
};

route.get("/", (req, res) => {
  res.render("index", {
    tagline: getTitle(`Saving Budget App`, ""),
  });
});
