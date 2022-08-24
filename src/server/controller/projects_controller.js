const projectsDB = require("../model/projects_db.js");

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

exports.delete = (req, res) => {};
