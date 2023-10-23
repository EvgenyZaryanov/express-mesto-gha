const UserModel = require("../models/user");
const BadRequestError = require("../errors/BadRequestError");
const NotFoundError = require("../errors/NotFoundError");
const InternalServerError = require("../errors/InternalServerError");
const STATUS_OK = require("../utils/constants");

const getUsers = (req, res) => {
  UserModel.find()
    .then((users) => {
      return res.status(STATUS_OK).send(users);
    })
    .catch((err) => {
      console.log(err);
      return res
        .status(InternalServerError)
        .send({ message: "Упс! Произошла ошибка на стороне сервера" });
    });
};

const getUserById = (req, res) => {
  const { userId } = req.params;

  UserModel.findById(userId)
    .then((user) => {
      if (!user) {
        return res
          .status(NotFoundError)
          .send({ message: "Пользователь не найден" });
      }
      return res.status(STATUS_OK).send(user);
    })
    .catch((err) => {
      console.log(err);
      if (err.name === "CastError") {
        return res
          .status(BadRequestError)
          .send({ message: "Передан невалидный id" });
      }
      return res
        .status(InternalServerError)
        .send({ message: "Упс! Произошла ошибка на стороне сервера" });
    });
};

const updateUser = (req, res) => {
  const owner = req.user._id;

  UserModel.findByIdAndUpdate(
    owner,
    { name: req.body.name, about: req.body.about },
    {
      new: true,
      runValidators: true,
    }
  )
    .then((user) => {
      if (!user) {
        return res
          .status(NotFoundError)
          .send({ message: "Пользователь c указанным id не найден" });
      }
      return res.status(STATUS_OK).send(user);
    })
    .catch((err) => {
      console.log(err);
      if (err.name === "ValidationError") {
        return res.status(BadRequestError).send({
          message: "Переданы некорректные данные при обновлении профиля",
        });
      }
      return res
        .status(InternalServerError)
        .send({ message: "Упс! Произошла ошибка на стороне сервера" });
    });
};

const updateUserAvatar = (req, res) => {
  const owner = req.user._id;

  UserModel.findByIdAndUpdate(
    owner,
    { avatar: req.body.avatar },
    {
      new: true,
      runValidators: true,
    }
  )
    .then((user) => {
      if (!user) {
        return res
          .status(NotFoundError)
          .send({ message: "Пользователь c указанным id не найден" });
      }
      return res.status(STATUS_OK).send(user);
    })
    .catch((err) => {
      console.log(err);
      if (err.name === "ValidationError") {
        return res.status(BadRequestError).send({
          message:
            "Переданы некорректные данные при обновлении аватара профиля",
        });
      }
      return res
        .status(InternalServerError)
        .send({ message: "Упс! Произошла ошибка на стороне сервера" });
    });
};

const getCurrentUser = (req, res, next) => {
  UserModel.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError("Пользователь не найден");
      }
      res.status(STATUS_OK).send(user);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(BadRequestError("Переданы некорректные данные"));
      } else if (err.message === "NotFound") {
        next(new NotFoundError("Пользователь не найден"));
      } else next(err);
    });
};

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  updateUserAvatar,
  getCurrentUser,
};
