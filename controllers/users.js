const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { CastError, ValidationError } = require("mongoose").Error;
const UserModel = require("../models/user");

const { JWT_SECRET } = require("../utils/config");
const { CREATED_201 } = require("../utils/constants");

const NotFoundError = require("../errors/NotFoundError");
const BadRequestError = require("../errors/BadRequestError");
const ConflictError = require("../errors/ConflictError");

const NotError = 200;

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => UserModel.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.status(CREATED_201).send({ data: user }))
    .catch((err) => {
      if (err.code === 11000) {
        next(
          new ConflictError("Пользователь с таким email уже зарегистрирован"),
        );
        return;
      }
      if (err instanceof ValidationError) {
        const errorMessage = Object.values(err.errors)
          .map((error) => error.message)
          .join(", ");
        next(new BadRequestError(`Некорректные данные: ${errorMessage}`));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  UserModel.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res
        .cookie("jwt", token, {
          maxAge: 3600000,
          httpOnly: true,
          sameSite: true,
        })
        .send({ token });
    })
    .catch(next);
};

const logout = (req, res) => {
  res.clearCookie("jwt").send({ message: "Вы вышли из системы" });
};

const getUsers = (req, res, next) => {
  UserModel.find({})
    .then((users) => res.send(users))
    .catch(next);
};

const getUserById = (req, res, next) => {
  const { userId } = req.params;

  UserModel.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError("Такого пользователя не существует");
      }
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof CastError) {
        next(new BadRequestError("Некорректный id пользователя"));
      } else {
        next(err);
      }
    });
};

const getCurrentUser = (req, res, next) => {
  const { _id } = req.user;
  UserModel.findById(_id)
    .orFail(() => new NotFoundError("Пользователь не найден"))
    .then((user) => {
      res.status(NotError).send({ data: user });
    })
    .catch((err) => {
      if (err instanceof CastError) {
        return next(new BadRequestError("Некорректный id пользователя"));
      }
      return next(err);
    });
};

const updateUser = (req, res, next) => {
  const owner = req.user._id;

  UserModel.findByIdAndUpdate(
    owner,
    { name: req.body.name, about: req.body.about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError("Такого пользователя не существует");
      }
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof CastError) {
        next(new BadRequestError("Некорректный id пользователя"));
      } else {
        next(err);
      }
    });
};

const updateUserAvatar = (req, res, next) => {
  const owner = req.user._id;

  UserModel.findByIdAndUpdate(
    owner,
    { avatar: req.body.avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError("Такого пользователя не существует");
      }
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof CastError) {
        next(new BadRequestError("Некорректный id пользователя"));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createUser,
  login,
  logout,
  getUsers,
  getUserById,
  getCurrentUser,
  updateUser,
  updateUserAvatar,
};
