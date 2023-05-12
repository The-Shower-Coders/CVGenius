const app = require('./main.js');
const setupRoutes = require('./backend.js');
const port = 3000;

setupRoutes(app);

app.listen(port, () => {
  console.log(`Uygulama http://localhost:${port} adresinde çalışıyor.`);
});