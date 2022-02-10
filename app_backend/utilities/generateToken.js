const jwt = require("jsonwebtoken")
const {
  SECRET
} = require("./constants")

const generateToken = (email) => {
  return jwt.sign({
    email
  }, SECRET, {
    algorithm: 'HS256',
    expiresIn: '7d'
  })
}

module.exports = generateToken
