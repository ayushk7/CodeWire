/*const mongoose = require("mongoose");

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

module.exports = projectsDB;*/
module.exports = mongoose => {
  var schema = mongoose.Schema({
    project_title: {
    type: String,
      require: true,
  },
  description: {
    type: String,
      require: false,
  }
  } );
  schema.method("toJSON", function() {
    // eslint-disable-next-line no-unused-vars
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });
  const projectsDB = mongoose.model("projectsDB", schema);
  return projectsDB;
};