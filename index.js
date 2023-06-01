const app = require('./main.js');
const {setupRoutes, setupDatabase} = require('./backend.js');
const port = 3000;

setupDatabase();
setupRoutes(app);

app.listen(port, () => {
  console.log(`Uygulama http://localhost:${port} adresinde çalışıyor.`);
});