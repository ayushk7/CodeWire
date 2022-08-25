const express = require("express");
const app = express();
const PORT = 8080;
// Connect to the database
require("./src/server/DB/connection");
const bodyParser = require("body-parser");
const cors = require("cors");
var corsOptions = {
  origin: "http://localhost:8081"
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
/*const path = require("path");
const util = require("util");*/
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Code Wire Server." });
});

/*const fs = require("fs");
const fileName = path.join(__dirname, "../ test.json");
let writeJSON;

if (!fs.existsSync(fileName)) {
  console.log(`${fileName} Doesnt Exists`);
  writeJSON = JSON.stringify({});
  fs.writeFileSync(fileName, writeJSON);
  console.log(`${fileName} Created`);
}
const budgetApp = await JSON.parse(fs.readFileSync(fileName));*/
require("./src/server/routes/routes")(app);
app.listen(PORT, () => {
  console.log(`Server is listening at http://localhost:${PORT}`);
});
