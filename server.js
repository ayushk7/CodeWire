const express = require("express");
const app = express();
const PORT = 5050;
// Connect to the database
require("./src/server/DB/connection");
const bodyParser = require("body-parser");
app.use(bodyParser.json());

const path = require("path");
const util = require("util");
require("vue-template-compiler");
require("vue-loader");
require("vue");

const fs = require("fs");
const fileName = path.join(__dirname, "../ test.json");
let writeJSON;

if (!fs.existsSync(fileName)) {
  console.log(`${fileName} Doesnt Exists`);
  writeJSON = JSON.stringify({});
  fs.writeFileSync(fileName, writeJSON);
  console.log(`${fileName} Created`);
}
/*const budgetApp = await JSON.parse(fs.readFileSync(fileName));*/
app.use("/", require("./src/server/routes/add_project.js"));
app.listen(PORT, () => {
  console.log(`Server is listening at http://localhost:${PORT}`);
});
