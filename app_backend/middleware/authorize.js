const jwt = require("jsonwebtoken")
const {
  SECRET
} = require("../utilities/constants")

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

module.exports = authorize
