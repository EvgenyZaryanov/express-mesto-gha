const UserModel = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const BadRequestError = require("../errors/BadRequestError");
const ConflictError = require("../errors/ConflictError");
const NotFoundError = require("../errors/NotFoundError");
const STATUS_CREATED = require("../utils/constants");

const { NODE_ENV, JWT_SECRET = "dev-secret" } = process.env;

const getUsers = (req, res, next) => {
  UserModel.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

const getUserById = (req, res, next) => {
  const { userId } = req.params;

  UserModel.findById(userId)
    .orFail(() => {
      throw new NotFoundError(`Пользователь c id: ${userId} не найден`);
    })
    .then((user) => {
      res.send({
        _id: user.id,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
      });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Передан некорректный id пользователя"));
      } else if (err.name === "NotFoundError") {
        next(new NotFoundError(`Пользователь c id: ${userId} не найден`));
      } else {
        next(err);
      }
    });
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;

  UserModel.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true }
  )
    .orFail(() => {
      throw new NotFoundError(`пользователь c id: ${req.user._id} не найден`);
    })
    .then((user) => {
      res.send({ name: user.name, about: user.about });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Некорректные данные для обновления профиля"));
      } else if (err.name === "NotFoundError") {
        next(new NotFoundError(`Пользователь c id: ${req.user._id} не найден`));
      } else {
        next(err);
      }
    });
};

const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;

  UserModel.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true }
  )
    .orFail(() => {
      throw new NotFoundError(`Пользователь с id: ${req.user._id} не найден`);
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Некорректные данные для обновления аватара"));
      } else if (err.name === "NotFoundError") {
        next(new NotFoundError(`Пользователь c id: ${req.user._id} не найден`));
      } else {
        next(err);
      }
    });
};

const getCurrentUser = (req, res, next) => {
  const { _id } = req.user;

  UserModel.findById(_id)
    .orFail(() => {
      throw new NotFoundError(`Пользователь c id: ${_id} не найден`);
    })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Передан невалидный id пользователя"));
      } else if (err.name === "NotFoundError") {
        next(new NotFoundError(`Пользователь c id: ${_id} не найден`));
      } else {
        next(err);
      }
    });
};

const createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) =>
      UserModel.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
    )
    .then((user) => {
      res.status(STATUS_CREATED).send({
        data: {
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          email: user.email,
        },
      });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Некорректные данные для обновления профиля"));
      } else if (err.code === 11000) {
        next(
          new ConflictError(
            "Пользователь с таким адресом эл.почты уже существует"
          )
        );
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  UserModel.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === "production" ? JWT_SECRET : "dev-secret",
        { expiresIn: "7d" }
      );
      res
        .cookie("jwt", token, {
          maxAge: 7 * 24 * 60 * 60,
          httpOnly: true,
          sameSite: true,
        })
        .send({ message: "Вы успешно авторизовались!" })
        .end();
    })
    .catch(next);
};

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  updateUserAvatar,
  getCurrentUser,
  createUser,
  login,
};
