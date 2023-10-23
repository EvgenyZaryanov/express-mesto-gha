const jwt = require("jsonwebtoken");
const UnauthorizedError = require("../errors/UnauthorizedError");

const authMiddleware = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    console.log(err);
    throw new UnauthorizedError("Необходима авторизация");
  }
  const token = authorization.replace("Bearer ", "");
  let payload;
  try {
    payload = jwt.verify(token, "some-secret-key");
  } catch (err) {
    return next(new UnauthorizedError("Необходима авторизация"));
  }
  req.user = payload;
  next();
};

module.exports = { authMiddleware };
