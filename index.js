const app = require('./main.js');
const {setupRoutes, setupDatabase} = require('./backend.js');
const port = 3000;

setupDatabase();
setupRoutes(app);

app.listen(port, () => {
  console.log(`[${'OKEY'.green}${`] Webapp running at ${`http://localhost:${port}`.underline.magenta}.`.blue}`.blue)
});

// Thanks to github.com/mattwelke (Which working on DigitalOcean) for supporting us on hosting website <3