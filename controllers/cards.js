const CardModel = require("../models/card");
const NotFoundError = require("../errors/NotFoundError");
const BadRequestError = require("../errors/BadRequestError");
const ForbiddenError = require("../errors/ForbiddenError");
const { STATUS_CREATED } = require("../utils/constants");

const getCards = (_, res, next) => {
  CardModel.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;

  CardModel.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Некорректные данные для создания карточки"));
      } else {
        next(err);
      }
    });
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;

  CardModel.findById(cardId)
    .orFail(() => {
      throw new NotFoundError(`Карточка с id: ${cardId} не найдена`);
    })
    .then((card) => {
      if (card.owner.toString() === req.user._id) {
        CardModel.findByIdAndRemove(cardId).then(() => res.send(card));
      } else {
        throw new ForbiddenError("Невозможно удалить чужую карточку");
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(
          new BadRequestError(
            `Передан некорректный id: ${cardId} для удаления карточки`
          )
        );
      } else if (err.name === "NotFoundError") {
        next(new NotFoundError(`Карточка с id: ${cardId} не найдена`));
      } else {
        next(err);
      }
    });
};

const likeCard = (req, res, next) => {
  const { cardId } = req.params;

  CardModel.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true }
  )
    .orFail(() => {
      throw new NotFoundError(`Карточка с id: ${cardId} не найдена`);
    })
    .then((card) => {
      res.status(STATUS_CREATED).send(card);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(
          new BadRequestError(
            `Передан некорректный id: ${cardId} для лайка карточки`
          )
        );
      } else if (err.name === "NotFoundError") {
        next(new NotFoundError(`Карточка с id: ${cardId} не найдена`));
      } else {
        next(err);
      }
    });
};

const dislikeCard = (req, res, next) => {
  const { cardId } = req.params;

  CardModel.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true, runValidators: true }
  )
    .orFail(() => {
      throw new NotFoundError(`Карточка с id: ${cardId} не найдена`);
    })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === "CastError") {
        next(
          new BadRequestError(
            `Передан некорректный id: ${cardId} для удаления лайка с карточки`
          )
        );
      } else if (err.name === "NotFoundError") {
        next(new NotFoundError(`Карточка с id: ${cardId} не найдена`));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
