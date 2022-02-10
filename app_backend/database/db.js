const mongoose = require("mongoose")
const logger = require("../logging/logger")
const {
  MONGO_URI
} = require("../utilities/constants")

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => logger.info("Connected to Mongodb"))
  .catch(() => logger.info("Could not connect to mongodb"));

module.exports = mongoose
