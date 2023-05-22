const app = require('./main.js');
let users = require('./private/users.json');
let resumes = require('./private/resumes.json');
var passwordValidator = require('password-validator');
const getBrowserInstance = require('./puppeteerInstance');
const { spawn } = require('child_process');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const {
  isAnyUndefined,
  isValueExists,
  updateJSON,
  newUser,
  isValidEmail

} = require('./utils.js');
const {
  json2html_template_standart
} = require('./template_standart.js');

getBrowserInstance()

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
    if (req.cookies.userid) {
      res.redirect('/resumes');
    }
    res.sendFile(__dirname + '/views/index.html');
  });

  app.get('/pricing', (req, res) => {
    if (req.cookies.userid) {
      res.redirect('/resumes');
    }
    res.sendFile(__dirname + '/views/pricing.html');
  });

  app.get('/signin', (req, res) => {
    if (req.cookies.userid) {
      res.redirect('/resumes');
    }
    else res.sendFile(__dirname + '/views/signin.html');
  });

  app.get('/signup', (req, res) => {
    if (req.cookies.userid) {
      res.redirect('/resumes');
    }
    res.sendFile(__dirname + '/views/signup.html');
  });

  app.get('/resumes', (req, res) => {
    if (!req.cookies.userid) {
      res.redirect('/signin');
    }
    res.sendFile(__dirname + '/views/resumes.html');
  });

  app.get('/app', (req, res) => {
    if (!req.cookies.userid) {
      res.redirect('/signin');
    }
    res.sendFile(__dirname + '/views/app.html');
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
  // -6 -> username must be at least 4 characters long
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

    if (name.length < 4) {
      return res.send({ code: -6 });
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

  // get resumes by userid
  // 0 -> success
  // -1 -> userid not found
  app.get('/api/getresumes', (req, res) => {
    const userid = req.query.userid;

    if (!userid) {
      return res.send({ code: -1 })
    }

    const resumeList = resumes.resumes.find(resumelist => resumelist.userid === userid);
    if (!resumeList) {
      return res.send({ code: -1 })
    }

    return res.send({ code: 0, resumeList: resumeList.storedResumes })
  });

  app.get('/api/getproject', (req, res) => {
    const projectid = req.query.projectid;

    if (!projectid) {
      return res.send({ code: -1 })
    }

    let returnData;
    resumes.resumes.forEach(resumelist => {
      resumelist.storedResumes.forEach(resume => {
        if (resume.projectId == projectid) {
          returnData = resume.json;
        }
      })
    })
    if (!returnData) {
      return res.send({ code: -1 })
    }

    return res.send({ code: 0, data: returnData })
  });

  app.get('/api/setproject', (req, res) => {
    const projectid = req.query.projectid;
    const json = req.query.json;

    if (!projectid) {
      return res.send({ code: -1 })
    }

    resumes.resumes.forEach(resumelist => {
      resumelist.storedResumes.forEach(resume => {
        if (resume.projectId == projectid) {
          resume.json = JSON.parse(json)
        }
      })
    })

    updateJSON('./private/resumes.json', resumes)
    return res.send({ code: 0 })
  });

  app.get('/api/getprofile', (req, res) => {
    const userid = req.query.userid;

    if (!userid) {
      return res.send({ code: -1 })
    }

    const user = users.users.find(usr => usr.userid === userid);
    if (!user) {
      return res.send({ code: -1 })
    }

    return res.send({ code: 0, profileUrl: user.profileUrl })
  });

  app.get('/api/json2pdf', (req, res) => {

    if (!req.query.json) {
      res.send({ code: -1 });
    }
    let html = json2html_template_standart(JSON.parse(decodeURIComponent(req.query.json)))

    let uuid = uuidv4();
    const filePath = __dirname + '/private/temp_previews/' + uuid + '.pdf';

    getBrowserInstance()
      .then(browser => browser.newPage())
      .then(page => page.setContent(html).then(() => page))
      .then(page => page.pdf({ path: './private/temp_previews/' + uuid + '.pdf', format: 'A4' }))
      .then(() => {
        // PDF successfully created
        // Send the response with the generated UUID
        res.sendFile(filePath, (error) => {
          if (error) {
            console.error('Error sending file:', error);
          } else {
            // Delete the file after sending it
            fs.unlink(filePath, (error) => {
              if (error) {
                console.error('Error deleting file:', error);
              }
            });
          }
        });
      })
      .catch((error) => {
        // Handle error
        console.log(error);
        res.send({ code: -1 });
      });
  });

  app.get('/api/askbard', async (req, res) => {
    if (!req.query.q) {
      res.send("query not specified. {err: -1}");
      return;
    }
  
    try {
      const { stdout } = await exec(`python bardcon.py "${req.query.q.replaceAll('"', '\"')}"`);
      res.send(stdout);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
}

module.exports = setupRoutes;