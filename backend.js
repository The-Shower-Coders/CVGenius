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
const path = require('path');
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
let blogs;

function setupDatabase() {
  try {
    client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });
    client.connect();
    client.db("admin").command({ ping: 1 });
    console.log(`[${'OKEY'.green}${'] Successfully connected to MongoDB.'.blue}`.blue)
    CVGeniusDB = client.db("CVGenius");
    accounts = CVGeniusDB.collection("Accounts");
    resumes = CVGeniusDB.collection("Resumes");
    blogs = CVGeniusDB.collection("Blogs");
  } catch (err) {
    console.log(`\n - [${' FAIL '.red.bold.underline}${'] Can not connected to MongoDB.'.gray}`.gray)
    console.log(` - ${err}\n`.gray)
    process.exit(0);
  }
}

function setupRoutes() {

  // --------------------------------------------------------------------------
  // --------------------------------------------------------------------------
  // --- PAGE ROUTES ----------------------------------------------------------
  // --------------------------------------------------------------------------
  // --------------------------------------------------------------------------

  app.get('/', async (req, res) => {
    // Yakında yorum satırını silicem. ~ Murat
    // if (req.cookies.userid) {
    //   res.redirect('/resumes');
    //   return
    // }
    res.sendFile(__dirname + '/views/index.html');
  });

  app.get('/pricing', async (req, res) => {
    // Yakında yorum satırını silicem. ~ Murat
    // if (req.cookies.userid) {
    //   res.redirect('/resumes');
    //   return
    // }
    res.sendFile(__dirname + '/views/pricing.html');
  });

  app.get('/signin', async (req, res) => {
    if (req.cookies.userid) {
      res.redirect('/resumes');
      return
    }
    else res.sendFile(__dirname + '/views/signin.html');
  });

  app.get('/signup', async (req, res) => {
    if (req.cookies.userid) {
      res.redirect('/resumes');
      return
    }
    res.sendFile(__dirname + '/views/signup.html');
  });

  app.get('/resumes', async (req, res) => {
    if (!req.cookies.userid) {
      res.redirect('/signin');
      return
    }
    res.sendFile(__dirname + '/views/resumes.html');
  });

  app.get('/app', async (req, res) => {
    if (!req.cookies.userid) {
      res.redirect('/signin');
      return
    }
    res.sendFile(__dirname + '/views/app.html');
  });

  app.get('/profile', async (req, res) => {
    if (!req.cookies.userid) {
      res.redirect('/signin');
      return
    }
    res.sendFile(__dirname + '/views/profile.html');
  });

  app.get('/blogs', async (req, res) => {
    res.sendFile(__dirname + '/views/blogs.html');
  });

  app.get('/blog/:blogid', async (req, res) => {
    const blogid = req.params.blogid;

    const blog = await blogs.findOne({ blogid: blogid });
    if (!blog) {
      const htmlString = `
        <html>
          <head>
            <title>Blog Not Found</title>
          </head>
          <body>
            <div style="display: flex;justify-content: center;">
              <h3>Blog not found. Redirecting to <b>/blogs</b></h3>
            </div>
            <script>
              setTimeout(() => {
                window.location.replace("/blogs");
              }, 2000);
            </script>
          </body>
        </html>`;
      res.setHeader('Content-Type', 'text/html');
      res.send(htmlString);
    }

    res.sendFile(__dirname + '/views/blog.html');
  });

  app.get('/communication', async (req, res) => {
    res.sendFile(__dirname + '/views/communication.html');
  });

  console.log(`[${'OKEY'.green}${'] Routes configured.'.blue}`.blue)

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

  app.get('/api/json2pdf', async (req, res) => {

    if (!req.query.json) {
      res.send({ code: -1 });
    }
    let html = json2html_template_standart(JSON.parse(decodeURIComponent(req.query.json)))

    let uuid = uuidv4();
    if (!fs.existsSync('./private/temp_previews/')) {
      fs.mkdirSync(directoryPath, { recursive: true });
    }
    try
    {
      fs.readdirSync(path.join(__dirname, 'private', 'temp_previews')).forEach(file => fs.unlinkSync(path.join(__dirname, 'private', 'temp_previews', file)));
    } catch { /* IGNORE */}
    const filePath = __dirname + '/private/temp_previews/' + uuid + '.pdf';

    getBrowserInstance()
      .then(browser => browser.newPage())
      .then(page => page.setContent(html).then(() => page))
      .then(page => page.pdf({ path: './private/temp_previews/' + uuid + '.pdf', format: 'A4' }))
      .then(() => {
        // PDF successfully created
        // Send the response with the generated UUID
        res.sendFile(filePath)
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
    const {userid, projectname, template} = req.query;

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

  app.get('/api/getblog', async (req, res) => {
    const blogid = req.query.blogid;

    if (!blogid) {
      return res.send({ code: -1 })
    }

    const blog = await blogs.findOne({ blogid });

    if (!blog) {
      return res.send({ code: -1 });
    }

    return res.send({ code: 0, blog: blog });

  });

  app.get('/api/getblogs', (req, res) => {
    blogs.find().toArray()
      .then(allBlogs => {
        res.send({ code: 0, blogs: allBlogs });
      })
      .catch(error => {
        console.error(error);
        res.send({ code: -1 });
      });
  });
  

  console.log(`[${'OKEY'.green}${'] APIs configured.'.blue}`.blue)
}

module.exports = { setupRoutes, setupDatabase };
