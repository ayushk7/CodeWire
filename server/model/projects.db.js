module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      project_title: {
        type: String,
        require: true,
      },
      description: {
        type: String,
        require: false,
      }
    });
  schema.method("toJSON", function() {
    // eslint-disable-next-line no-unused-vars
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });
  const projectsDB = mongoose.model("projectsDB", schema);
  return projectsDB;
};
