const jwt = require("jsonwebtoken");
const UnauthorizedError = require("../errors/UnauthorizedError");

// const { JWT_SECRET } = require("../utils/config");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
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

// module.exports = (req, res, next) => {
//   const token = req.cookies.jwt;
//   if (!token) {
//     return next(new UnauthorizedError("Проблема с токеном"));
//   }
//   let payload;
//   try {
//     payload = jwt.verify(token, JWT_SECRET);
//   } catch (err) {
//     return next(new UnauthorizedError("Проблема с токеном"));
//   }
//   req.user = payload;
//   return next();
// };
