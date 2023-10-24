const {
  PORT = 3000,
  DB = "mongodb://127.0.0.1:27017/mestodb",
  JWT_SECRET = "CCD34142A3247B5AFD845A6D6C59C3AD700703C9B6EE930436128D3CF2260DDB",
} = process.env;

module.exports = {
  PORT,
  DB,
  JWT_SECRET,
};
