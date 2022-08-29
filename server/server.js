const express = require("express");
const app = express();
const PORT = 5050;
// Connect to the database
require("./database/connection");

const cors = require("cors");
var corsOptions = {
  origin: "http://localhost:5051"
};
app.use(cors(corsOptions));

app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Code Wire Server." });
});

require("./routes/projects.route")(app);
require("./routes/scripts.route")(app);
app.listen(PORT, () => {
  console.log(`Server is listening at http://localhost:${PORT}`);
});
