/*const projectsDB = require("../model/projects_db.js");

exports.create = (req, res) => {
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty!" });
  }

  const projects = new projectsDB({
    project_title: req.body.project_title,
    description: req.body.description,
  });
  projects
    .save(projects)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while creating a create operation",
      });
    });
};

exports.find = (req, res) => {};

exports.update = (req, res) => {};

exports.delete = (req, res) => {};*/
const db = require("../model/index");
console.log(db);
const project = db.project;

// Create and Save a new project
exports.create = (req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }
  // Create a project
  const Project = new project({
    project_title: req.body.project_title,
    description: req.body.description,
  });
  // Save project in the database
  Project
    .save(Project)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Project."
      });
    });
};
// Retrieve all projects from the database.
exports.findAll = (req, res) => {
  const title = req.query.project_title;
  var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};
  project.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving projects."
      });
    });
};
// Find a single project with an id
exports.findOne = (req, res) => {
  const id = req.params.id;
  project.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Project not found with id " + id });
      else res.send(data);
    })
    // eslint-disable-next-line no-unused-vars
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving project with id=" + id });
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
  project.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
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
  project.findByIdAndRemove(id)
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete project with id=${id}. Maybe project was not found!`
        });
      } else {
        res.send({
          message: "Project was deleted successfully!"
        });
      }
    })
    // eslint-disable-next-line no-unused-vars
    .catch(err => {
      res.status(500).send({
        message: "Could not delete project with id=" + id
      });
    });
};
// Delete all projects from the database.
exports.deleteAll = (req, res) => {
  project.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} Projects were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all projects."
      });
    });
};

