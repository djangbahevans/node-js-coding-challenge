const express = require("express")
const router = express.Router()
const authorize = require("../middleware/authorize")
const User = require("../models/User")
const generateToken = require("../utilities/generateToken")
const bcrypt = require("bcryptjs")
const logger = require("../logging/logger")


router.post('/register', async (req, res) => {
  logger.info("/api/register")
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

  if (existingUser) return res.sendStatus(400);

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

router.post('/login', async (req, res) => {
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

router.get('/profile', authorize, async (req, res) => {
  const {
    email
  } = req.user

  const user = await User.findOne({
    email
  })

  return res.send(user)
});

module.exports = router
