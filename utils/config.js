const {
  PORT = 3000,
  DB = 'mongodb://127.0.0.1:27017/mestodb',
  JWT_SECRET = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
} = process.env;

module.exports = {
  PORT,
  DB,
  JWT_SECRET,
};
