const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const UserSchema = new Schema({
  name: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  hash: {
    type: String,
    required: true
  }
});

UserSchema.methods.verifyPassword = function (password) {
  return bcrypt.compareSync(password, this.hash);
};

const Users = mongoose.model('User', UserSchema);

module.exports = Users;
