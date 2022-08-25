/*const mongoose = require("mongoose");

mongoose.connect(url, { useNewUrlParser: true });

const db = mongoose.connection;
// eslint-disable-next-line no-unused-vars
db.once("open", (_) => {
  console.log("Database connected:", url);
});

db.on("error", (err) => {
  console.error("connection error:", err);
});*/
const db = require("../model/index.js");
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });
