const db = require("../model/index");
const script = db.script;

// Create and Save a new project
exports.create = (req, res) => {
  // Validate request
  if (!req.body.script_title) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }
  // Create a project
  const Script = new script({
    script_title: req.body.script_title,
    description: req.body.description
  });
  // Save project in the database
  Script
    .save(Script)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Script."
      });
    });
};
// Retrieve all projects from the database.
exports.findAll = (req, res) => {
  const title = req.query.script_title;
  var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};
  script.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving scripts."
      });
    });
};
// Find a single project with an id
exports.find = (req, res) => {
  const id = req.params.id;
  script.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Script not found with id " + id });
      else res.send(data);
    })
    // eslint-disable-next-line no-unused-vars
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving script with id=" + id });
    });
};
// Update a project by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }
  const id = req.params.id;
  script.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update project with id=${id}. Maybe the project was not found!`
        });
      } else res.send({ message: "Project was updated successfully." });
    })
    // eslint-disable-next-line no-unused-vars
    .catch(err => {
      res.status(500).send({
        message: "Error updating project with id=" + id
      });
    });
};
// Delete a project with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  script.findByIdAndRemove(id)
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete script with id=${id}. Maybe script was not found!`
        });
      } else {
        res.send({
          message: "Script was deleted successfully!"
        });
      }
    })
    // eslint-disable-next-line no-unused-vars
    .catch(err => {
      res.status(500).send({
        message: "Could not delete script with id=" + id
      });
    });
};
// Delete all projects from the database.
exports.deleteAll = (req, res) => {
  script.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} Scripts were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all scripts."
      });
    });
};