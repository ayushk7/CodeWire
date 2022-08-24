const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  project_title: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: false,
  },
});

const projectsDB = mongoose.model("projectsDB", schema);

module.exports = projectsDB;
