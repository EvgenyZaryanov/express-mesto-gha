const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const UserModel = require("../models/user");
const BadRequestError = require("../errors/BadRequestError");
const ConflictError = require("../errors/ConflictError");
const STATUS_CREATED = require("../utils/constants");

const createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => {
      UserModel.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
        .then(() =>
          res.status(STATUS_CREATED).send({
            data: {
              name,
              about,
              avatar,
              email,
            },
          })
        )
        .catch((err) => {
          if (err.code === 11000) {
            return next(
              new ConflictError("Пользователь с таким email уже существует")
            );
          }
          if (err.name === "ValidationError") {
            return next(new BadRequestError("Некорректные данные"));
          }
          next(err);
        });
    })
    .catch(next);
};
const login = (req, res, next) => {
  const { email, password } = req.body;
  return UserModel.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, "some-secret-key", {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch(next);
};

module.exports = {
  createUser,
  login,
};
