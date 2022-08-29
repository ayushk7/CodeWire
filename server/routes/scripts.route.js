module.exports = app => {
  const scripts = require( "../controller/scripts.controller.js" );
  var router = require("express").Router();
  router.post( "/", scripts.create );
// Retrieve all projects
  router.get( "/", scripts.findAll );
// Retrieve a single project with id
  router.get( "/:id", scripts.find );
// Update a project with id
  router.put( "/:id", scripts.update );
// Delete a project with id
  router.delete( "/:id", scripts.delete );
// Create a new project
  router.delete( "/", scripts.deleteAll );
  app.use( '/api/scripts', router );
}