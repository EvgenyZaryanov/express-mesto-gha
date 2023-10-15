const CardModel = require("../models/card");

const STATUS_OK = 200;
const ERROR_VALIDATION = 400;
const ERROR_NOT_FOUND = 404;
const ERROR_SERVER = 500;

const createCard = (req, res) => {
  console.log(req.user._id);
  const { name, link } = req.body;
  const owner = req.user._id;

  CardModel.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(ERROR_VALIDATION).send({
          message: "Переданы некорректные данные при создании карточки",
        });
      }
      return res
        .status(ERROR_SERVER)
        .send({ message: "Упс! Произошла ошибка на стороне сервера" });
    });
};

const getCards = (req, res) => {
  CardModel.find({})
    .then((cards) => res.send(cards))
    .catch((err) => {
      console.log(err);
      return res
        .status(ERROR_SERVER)
        .send({ message: "Упс! Произошла ошибка на стороне сервера" });
    });
};

const deleteCard = (req, res) => {
  CardModel.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res
          .status(ERROR_NOT_FOUND)
          .send({ message: "Карточка с указанным id не найдена" });
      }
      return res.status(STATUS_OK).send(card);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(ERROR_VALIDATION).send({
          message: "Переданы некорректные данные для обновления профиля",
        });
      }
      return res
        .status(ERROR_SERVER)
        .send({ message: "Упс! Произошла ошибка на стороне сервера" });
    });
};

const likeCard = (req, res) => {
  CardModel.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        return res
          .status(ERROR_NOT_FOUND)
          .send({ message: "Передан несуществующий id" });
      }
      return res.status(STATUS_OK).send(card);
    })
    .catch((err) => {
      console.log(err);
      if (err.name === "CastError") {
        return res.status(ERROR_VALIDATION).send({
          message: "Переданы некорректные данные для постановки лайка",
        });
      }
      return res
        .status(ERROR_SERVER)
        .send({ message: "Упс! Произошла ошибка на стороне сервера" });
    });
};

const dislikeCard = (req, res) => {
  CardModel.findByIdAndUpdate(
    req.params.cardId,

    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        return res
          .status(ERROR_NOT_FOUND)
          .send({ message: "Передан несуществующий id" });
      }
      res.status(STATUS_OK).send(card);
    })
    .catch((err) => {
      console.log(err);
      if (err.name === "CastError") {
        return res
          .status(ERROR_VALIDATION)
          .send({ message: "Переданы некорректные данные для удаления лайка" });
      }
      return res
        .status(ERROR_SERVER)
        .send({ message: "Упс! Произошла ошибка на стороне сервера" });
    });
};

module.exports = {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
};
