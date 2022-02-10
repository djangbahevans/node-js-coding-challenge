const SECRET = process.env.SECRET || "VBHyy8NlAizMDZy9f76ZMCW6Q6geUdWaPBoeyIAglzOHDRBrlegFvs8G3/LRl696bUDrf9AbvOJifAt5y25JEw==";
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/test";

module.exports = {
  SECRET,
  MONGO_URI
}
