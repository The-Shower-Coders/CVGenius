const app = require('./main.js');
const { MongoClient, ServerApiVersion } = require('mongodb');
var passwordValidator = require('password-validator');
const getBrowserInstance = require('./puppeteerInstance');
var colors = require('colors');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
const { v4: uuidv4 } = require('uuid');
const sha1 = require('sha1');
const fs = require('fs');
const {
  isAnyUndefined,
  isValueExists,
  updateJSON,
  newUser,
  isValidEmail

} = require('./utils.js');
const {
  json2html_template_standart,
  getTemplate
} = require('./template_standart.js');
colors.enable()
getBrowserInstance()

var schema = new passwordValidator();
schema
  .is().min(8)                                    // Minimum length 8
  .is().max(100)                                  // Maximum length 100
  .has().uppercase()                              // Must have uppercase letters
  .has().lowercase()                              // Must have lowercase letters
  .has().digits(2)                                // Must have at least 2 digits
  .has().not().spaces()                           // Should not have spaces


// Setup Database Connection
const uri = process.env.MONGODB;

let client;
let CVGeniusDB;
let accounts;
let resumes;

function setupDatabase() {
  try {
    client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });
    // Connect the client to the server	(optional starting in v4.7)
    client.connect();
    // Send a ping to confirm a successful connection
    client.db("admin").command({ ping: 1 });
    console.log("Successfully connected to MongoDB".green);

    CVGeniusDB = client.db("CVGenius");
    accounts = CVGeniusDB.collection("Accounts");
    resumes = CVGeniusDB.collection("Resumes");
  } catch {
    console.log("Can not connected to MongoDB".red);
    process.exit(0);
  }
}

function setupRoutes() {

  // --------------------------------------------------------------------------
  // --------------------------------------------------------------------------
  // --- PAGE ROUTES ----------------------------------------------------------
  // --------------------------------------------------------------------------
  // --------------------------------------------------------------------------

  app.get('/', (req, res) => {
    if (req.cookies.userid) {
      res.redirect('/resumes');
      return
    }
    res.sendFile(__dirname + '/views/index.html');
  });

  app.get('/pricing', (req, res) => {
    if (req.cookies.userid) {
      res.redirect('/resumes');
      return
    }
    res.sendFile(__dirname + '/views/pricing.html');
  });

  app.get('/signin', (req, res) => {
    if (req.cookies.userid) {
      res.redirect('/resumes');
      return
    }
    else res.sendFile(__dirname + '/views/signin.html');
  });

  app.get('/signup', (req, res) => {
    if (req.cookies.userid) {
      res.redirect('/resumes');
      return
    }
    res.sendFile(__dirname + '/views/signup.html');
  });

  app.get('/resumes', (req, res) => {
    if (!req.cookies.userid) {
      res.redirect('/signin');
      return
    }
    res.sendFile(__dirname + '/views/resumes.html');
  });

  app.get('/app', (req, res) => {
    if (!req.cookies.userid) {
      res.redirect('/signin');
      return
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
  app.get('/api/signup', async (req, res) => {
    // get values from query params
    const name = req.query.name,
      pass = req.query.password,
      mail = req.query.mail;

    // check undefined parameters
    if (isAnyUndefined(name, pass, mail)) {
      return res.send({ code: -1 })
    }

    // check if user already exits
    const existingUser = await accounts.findOne({ $or: [{ mail: mail }, { username: name }] });
    if (existingUser) {
      if (existingUser.mail === mail) {
        return res.send({ code: -3 });
      }
      if (existingUser.username === name) {
        return res.send({ code: -2 });
      }
    }

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
    const resume = {
      userid: user.userid,
      storedResumes: []
    }
    accounts.insertOne(user);
    resumes.insertOne(resume);
    return res.send({ code: 0, userid: user.userid })
  });

  // login user
  // ?nameormail, ?password
  // 0 -> success
  // -1 -> (name || mail) & password required
  // -2 -> user not exits
  app.get('/api/signin', async (req, res) => {
    // get values from query params
    let nameormail = req.query.nameormail,
      pass = sha1(req.query.password);

    // check undefined parameters
    if (isAnyUndefined(nameormail, pass)) {
      return res.send({ code: -1 })
    }

    const existingUser = await accounts.findOne({
      $or: [
        { mail: nameormail },
        { username: nameormail }
      ],
      password: pass
    });

    if (existingUser) {
      return res.send({ code: 0, userid: existingUser.userid })
    } else {
      return res.send({ code: -2 })
    }
  });

  // get resumes by userid
  // 0 -> success
  // -1 -> userid not found
  // -2 -> user not found
  app.get('/api/getresumes', async (req, res) => {
    const userid = req.query.userid;

    if (!userid) {
      return res.send({ code: -1 })
    }

    const resumeList = await resumes.findOne({ userid: userid });
    if (!resumeList) {
      return res.send({ code: -2 })
    }

    return res.send({ code: 0, resumeList: resumeList.storedResumes })
  });

  app.get('/api/getproject', async (req, res) => {
    const projectid = req.query.projectid;

    if (!projectid) {
      return res.send({ code: -1 })
    }

    const cursor = resumes.find({});
    let found;
    await cursor.forEach(async (resume) => {
      const storedResumes = resume.storedResumes;
      const matchingProjects = storedResumes.filter(project => project.projectId === projectid);

      if (matchingProjects.length > 0) {
        found = matchingProjects[0];
      }
    });

    if (found) {
      return res.send({ code: 0, data: found.json })
    } else {
      return res.send({ code: -2 })
    }
  });

  app.get('/api/setproject', async (req, res) => {
    const projectid = req.query.projectid;
    const json = req.query.json;

    if (!projectid) {
      return res.send({ code: -1 })
    }
    
    await resumes.updateMany(
      { "storedResumes.projectId": projectid },
      { $set: { "storedResumes.$[elem].json": JSON.parse(json) } },
      { arrayFilters: [{ "elem.projectId": projectid }] }
    );

    return res.send({ code: 0 })
  });

  app.get('/api/getprofile', async (req, res) => {
    const userid = req.query.userid;

    if (!userid) {
      return res.send({ code: -1 })
    }

    const user = await accounts.findOne({ userid: userid });

    if (!user) {
      return res.send({ code: -1 });
    }

    return res.send({ code: 0, profileUrl: user.profileUrl });

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

  app.get('/api/create', async (req, res) => {
    const
      userid = req.query.userid,
      projectname = req.query.projectname,
      template = req.query.template;

    // check undefined parameters
    if (isAnyUndefined(userid, projectname, template)) {
      return res.send({ code: -1 })
    }

    let uuid = uuidv4();

    const resumeList = await resumes.findOne({ userid: userid });
    resumeList.storedResumes.push({
      projectName: projectname,
      projectId: uuid,
      template: template,
      json: getTemplate()
    });
    await resumes.updateOne({ userid: userid }, { $set: { storedResumes: resumeList.storedResumes } });
    return res.send({ code: 0, projectId: uuid })
  })
}

module.exports = { setupRoutes, setupDatabase };
