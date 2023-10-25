const CardModel = require("../models/card");

const { CastError, ValidationError } = require("mongoose").Error;

const NotFoundError = require("../errors/NotFoundError");
const BadRequestError = require("../errors/BadRequestError");
const ForbiddenError = require("../errors/ForbiddenError");

const { CREATED_201 } = require("../utils/constants");

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const { _id: userId } = req.user;

  CardModel.create({ name, link, owner: userId })
    .then((card) => res.status(CREATED_201).send(card))
    .catch((err) => {
      if (err instanceof ValidationError) {
        const errorMessage = Object.values(err.errors)
          .map((error) => error.message)
          .join(" ");
        next(new BadRequestError(`Некорректные данные: ${errorMessage}`));
      } else {
        next(err);
      }
    });
};

const getCards = (req, res, next) => {
  CardModel.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

const deleteCardById = (req, res, next) => {
  const { cardId } = req.params;
  const { _id: userId } = req.user;

  CardModel.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError("Такой карточки не существует");
      }
      if (userId !== card.owner.toString()) {
        throw new ForbiddenError("Нельзя удалить чужую карточку");
      }
      return CardModel.findByIdAndRemove(cardId).then(() =>
        res.send({ message: "Карточка удалена" })
      );
    })
    .catch((err) => {
      if (err instanceof CastError) {
        next(new BadRequestError("Некорректный id карточки"));
      } else {
        next(err);
      }
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
        throw new NotFoundError("Такой карточки не существует");
      }
      res.send(card);
    })
    .catch((err) => {
      if (err instanceof CastError) {
        next(new BadRequestError("Некорректный id карточки"));
      } else {
        next(err);
      }
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
        throw new NotFoundError("Такой карточки не существует");
      }
      res.send(card);
    })
    .catch((err) => {
      if (err instanceof CastError) {
        next(new BadRequestError("Некорректный id карточки"));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createCard,
  getCards,
  deleteCardById,
  likeCard,
  dislikeCard,
};
