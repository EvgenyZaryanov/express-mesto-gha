const UserModel = require("../models/user");

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  // console.log(userData);
  return UserModel.create({ name, about, avatar })
    .then((data) => {
      return res.status(201).send(data);
    })
    .catch((err) => {
      console.log(err);
      if (err.name === "ValidationError") {
        return res
          .status(400)
          .send({ message: "Переданы некорректные данные пользователя" });
      }
      return res
        .status(500)
        .send({ message: "Упс! Произошла ошибка на стороне сервера" });
    });
};

const getUsers = (req, res) => {
  UserModel.find()
    .then((users) => {
      return res.status(200).send(users);
    })
    .catch((err) => {
      console.log(err);
      return res
        .status(500)
        .send({ message: "Упс! Произошла ошибка на стороне сервера" });
    });
};

const getUserById = (req, res) => {
  const { userId } = req.params;

  UserModel.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "Пользователь не найден" });
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      console.log(err);
      if (err.name === "CastError") {
        return res.status(400).send({ message: "Передан не валидный id" });
      }
      return res
        .status(500)
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
          .status(404)
          .send({ message: "Пользователь c указанным id не найден" });
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      console.log(err);
      if (err.name === "ValidationError") {
        return res.status(400).send({
          message: "Переданы некорректные данные при обновлении профиля",
        });
      }
      return res
        .status(500)
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
          .status(404)
          .send({ message: "Пользователь c указанным id не найден" });
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      console.log(err);
      if (err.name === "ValidationError") {
        return res.status(400).send({
          message:
            "Переданы некорректные данные при обновлении аватара профиля",
        });
      }
      return res
        .status(500)
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
