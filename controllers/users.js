const UserModel = require("../models/user");

const STATUS_OK = 200;
const STATUS_CREATED = 201;
const ERROR_VALIDATION = 400;
const ERROR_NOT_FOUND = 404;
const ERROR_SERVER = 500;

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  return UserModel.create({ name, about, avatar })
    .then((data) => {
      return res.status(STATUS_CREATED).send(data);
    })
    .catch((err) => {
      console.log(err);
      if (err.name === "ValidationError") {
        return res
          .status(ERROR_VALIDATION)
          .send({ message: "Переданы некорректные данные пользователя" });
      }
      return res
        .status(ERROR_SERVER)
        .send({ message: "Упс! Произошла ошибка на стороне сервера" });
    });
};

const getUsers = (req, res) => {
  UserModel.find()
    .then((users) => {
      return res.status(STATUS_OK).send(users);
    })
    .catch((err) => {
      console.log(err);
      return res
        .status(ERROR_SERVER)
        .send({ message: "Упс! Произошла ошибка на стороне сервера" });
    });
};

const getUserById = (req, res) => {
  const { userId } = req.params;

  UserModel.findById(userId)
    .then((user) => {
      if (!user) {
        return res
          .status(ERROR_NOT_FOUND)
          .send({ message: "Пользователь не найден" });
      }
      return res.status(STATUS_OK).send(user);
    })
    .catch((err) => {
      console.log(err);
      if (err.name === "CastError") {
        return res
          .status(ERROR_VALIDATION)
          .send({ message: "Передан невалидный id" });
      }
      return res
        .status(ERROR_SERVER)
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
          .status(ERROR_NOT_FOUND)
          .send({ message: "Пользователь c указанным id не найден" });
      }
      return res.status(STATUS_OK).send(user);
    })
    .catch((err) => {
      console.log(err);
      if (err.name === "ValidationError") {
        return res.status(ERROR_VALIDATION).send({
          message: "Переданы некорректные данные при обновлении профиля",
        });
      }
      return res
        .status(ERROR_SERVER)
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
          .status(ERROR_NOT_FOUND)
          .send({ message: "Пользователь c указанным id не найден" });
      }
      return res.status(STATUS_OK).send(user);
    })
    .catch((err) => {
      console.log(err);
      if (err.name === "ValidationError") {
        return res.status(ERROR_VALIDATION).send({
          message:
            "Переданы некорректные данные при обновлении аватара профиля",
        });
      }
      return res
        .status(ERROR_SERVER)
        .send({ message: "Упс! Произошла ошибка на стороне сервера" });
    });
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  updateUserAvatar,
};
