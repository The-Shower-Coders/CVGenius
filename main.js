const express = require('express');
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

// ... configure the app ...
app.use(cors());
app.use(express.static('public'));
app.use(cookieParser());
app.use(bodyParser.json());

module.exports = app; 