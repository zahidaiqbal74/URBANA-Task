const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

require('dotenv').config();

const api = require('./api');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api', api);

module.exports = app;