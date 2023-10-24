const {
  PORT = 3000,
  DB = "mongodb://127.0.0.1:27017/mestodb",
  JWT_SECRET = "secret_key",
} = process.env;

module.exports = {
  PORT,
  DB,
  JWT_SECRET,
};
