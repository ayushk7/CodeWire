require("express-vue");
//const route = express.Router();
const { route } = require("express/lib/router");

route.get("/add-project", (req, res) => {
  res.renderVue("../src/views/AddProjectView.vue", data);
});
require("../api/api.js");
const { data } = require("autoprefixer");

module.exports = route;
