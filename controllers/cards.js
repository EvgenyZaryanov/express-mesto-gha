const CardModel = require("../models/card");

const { CastError, ValidationError } = require("mongoose").Error;

const NotFoundError = require("../errors/NotFoundError");
const BadRequestError = require("../errors/BadRequestError");
const ForbiddenError = require("../errors/ForbiddenError");

// const { CREATED_201 } = require("../utils/constants");

const createCard = (req, res, next) => {
  console.log(req.user._id);
  const { name, link } = req.body;
  const owner = req.user._id;

  CardModel.create({ name, link, owner })
    .then((card) => res.send(card))
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

const changeLikeCardStatus = (req, res, next, likeOptions) => {
  const { cardId } = req.params;

  return CardModel.findByIdAndUpdate(cardId, likeOptions, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundError("Такой карточки не существует");
      }
      return card;
    })
    .catch((err) => {
      if (err instanceof CastError) {
        next(new BadRequestError("Некорректный id карточки"));
      } else {
        next(err);
      }
    });
};

const likeCard = (req, res, next) => {
  const { _id: userId } = req.user;
  const likeOptions = { $addToSet: { likes: userId } };
  changeLikeCardStatus(req, res, next, likeOptions);
};

const dislikeCard = (req, res, next) => {
  const { _id: userId } = req.user;
  const likeOptions = { $pull: { likes: userId } };
  changeLikeCardStatus(req, res, next, likeOptions);
};

module.exports = {
  createCard,
  getCards,
  deleteCardById,
  changeLikeCardStatus,
  likeCard,
  dislikeCard,
};
