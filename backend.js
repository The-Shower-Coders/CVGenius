const app = require('./main.js');
const users = require('./private/users.json');
var passwordValidator = require('password-validator');
const {
  isAnyUndefined,
  isValueExists,
  updateJSON,
  newUser,
  isValidEmail

} = require('./utils.js');

var schema = new passwordValidator();
schema
  .is().min(8)                                    // Minimum length 8
  .is().max(100)                                  // Maximum length 100
  .has().uppercase()                              // Must have uppercase letters
  .has().lowercase()                              // Must have lowercase letters
  .has().digits(2)                                // Must have at least 2 digits
  .has().not().spaces()                           // Should not have spaces


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
    if (req.cookies.userid) {
      res.redirect('/app');
    }
    else res.sendFile(__dirname + '/views/signin.html');
  });

  app.get('/signup', (req, res) => {
    if (req.cookies.userid) {
      res.redirect('/app');
    }
    res.sendFile(__dirname + '/views/signup.html');
  });

  // --------------------------------------------------------------------------
  // --------------------------------------------------------------------------
  // --- API ROUTES -----------------------------------------------------------
  // --------------------------------------------------------------------------
  // --------------------------------------------------------------------------

  // create a new user
  // ?name, ?password, ?mail
  // 0 -> success
  // -1 -> name & password & mail required
  // -2 -> name already exists
  // -3 -> mail already exists
  // -4 -> mail not valid (  *@*.*  )
  // -5 -> password not valid
  app.get('/api/signup', (req, res) => {
    // get values from query params
    const name = req.query.name,
      pass = req.query.password,
      mail = req.query.mail;

    // check undefined parameters
    if (isAnyUndefined(name, pass, mail)) {
      return res.send({ code: -1 })
    }

    // check if user already exits
    if (isValueExists(users.users, 'username', name)) return res.send({ code: -2 });
    if (isValueExists(users.users, 'mail', mail)) return res.send({ code: -3 });

    // check is mail valid
    if (!isValidEmail(mail)) return res.send({ code: -4 });

    // check validity of password
    if (!schema.validate(pass)) {
      return res.send({ code: -5, problems: schema.validate(pass, { list: true }) })
    }

    // create account
    const user = newUser(name, pass, mail)
    users.users.push(user);
    updateJSON('./private/users.json', users)
    return res.send({ code: 0, userid: user.userid })
  });

  // login user
  // ?nameormail, ?password
  // 0 -> success
  // -1 -> (name || mail) & password required
  // -2 -> user not exits
  app.get('/api/signin', (req, res) => {
    // get values from query params
    const nameormail = req.query.nameormail,
      pass = req.query.password;

    // check undefined parameters
    if (isAnyUndefined(nameormail, pass)) {
      return res.send({ code: -1 })
    }

    // check user exits
    let userid;
    if (isValidEmail(nameormail)) {
      // mail login
      const user = users.users.find(user => user.mail === nameormail && user.password === pass);
      if (!user) {
        return res.send({ code: -2 })
      }
      userid = user.userid
    } else {
      // username login
      const user = users.users.find(user => user.username === nameormail && user.password === pass);
      if (!user) {
        return res.send({ code: -2 })
      }
      userid = user.userid
    }

    return res.send({ code: 0, userid: userid })
  });
}

module.exports = setupRoutes;