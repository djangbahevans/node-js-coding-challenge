'use strict';

const bcrypt = require("bcryptjs")
const express = require('express');
const app = express();
const mongoose = require("mongoose");
const {
  createLogger,
  transports,
  format
} = require('winston');
const bodyParser = require('body-parser');
const path = require('path');
const User = require("./app_backend/models/User");
const jwt = require("jsonwebtoken")

const MONGO_URI = "mongodb://127.0.0.1:27017/test";
const SECRET = "VBHyy8NlAizMDZy9f76ZMCW6Q6geUdWaPBoeyIAglzOHDRBrlegFvs8G3/LRl696bUDrf9AbvOJifAt5y25JEw==";

const logger = createLogger({
  level: 'info',
  format: format.combine(format.timestamp(), format.prettyPrint()),
  transports: new transports.File({
    filename: path.join(__dirname, 'logfile.log')
  }),
  exceptionHandlers: [
    new transports.File({
      filename: path.join(__dirname, 'exceptions.log')
    })
  ]
});


mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
// .then(() => logger.info("Connected to Mongodb"))
// .catch(() => logger.info("Could not connect to mongodb"));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));


const generateToken = (email) => {
  return jwt.sign({
    email
  }, SECRET, {
    algorithm: 'HS256',
    expiresIn: '7d'
  })
}

const authorize = (req, res, next) => {
  const header = req.headers["authorization"]
  const token = header && header.split(" ")[1]

  if (!token) return res.sendStatus(401)

  try {
    const user = jwt.verify(token, SECRET)
    req.user = user

    next()
  } catch (err) {
    return res.sendStatus(401)
  }
}

/**
 * ROUTES_start
 */
app.post('/api/register', async (req, res) => {
  // logger.info("POST /api/register")
  const {
    email,
    password,
    name
  } = req.body;

  if (!email) return res.sendStatus(400);
  if (!password) return res.sendStatus(400);

  const existingUser = await User.findOne({
    email
  });
  if (existingUser) res.sendStatus(400);

  const salt_rounds = 10;
  const salt = await bcrypt.genSalt(salt_rounds)
  const hash = await bcrypt.hash(password, salt);

  const user = await User.create({
    email,
    hash,
    name
  })

  const token = generateToken(user.email)

  res.status(201).send({
    token
  })
});

app.post('/api/login', async (req, res) => {
  const {
    email,
    password
  } = req.body

  const user = await User.findOne({
    email
  })

  if (!user) return res.sendStatus(400)

  const verify = user.verifyPassword(password)

  if (!verify) return

  const token = generateToken(user.email)

  res.status(200).send({
    token
  })
});

app.get('/api/profile', authorize, async (req, res) => {
  logger.info(req.user.email)
  const {
    email
  } = req.user

  const user = await User.findOne({
    email
  })

  return res.send(user)
});

module.exports = app;
