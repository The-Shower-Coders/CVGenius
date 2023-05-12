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

  app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
  });

  app.get('/signin', (req, res) => {
    res.sendFile(__dirname + '/views/signin.html');
  });

  app.get('/signup', (req, res) => {
    res.sendFile(__dirname + '/views/signin.html');
  });
}

module.exports = setupRoutes;