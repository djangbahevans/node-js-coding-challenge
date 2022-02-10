'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

require("./app_backend/database/db")
const api = require("./app_backend/routers/api")


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use("/api", api)

module.exports = app;
