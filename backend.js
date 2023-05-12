const app = require('./main.js');
const users = require('./private/users.json');
const {
  isAnyUndefined,
  isValueExists,
  updateJSON,
  newUser,
  isValidEmail

} = require('./utils.js');

function setupRoutes() {

  // --------------------------------------------------------------------------
  // --------------------------------------------------------------------------
  // --- PAGE ROUTES ----------------------------------------------------------
  // --------------------------------------------------------------------------
  // --------------------------------------------------------------------------

  // islogin true  -> /app
  // islogin false -> /
  app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
  });

}

module.exports = setupRoutes;