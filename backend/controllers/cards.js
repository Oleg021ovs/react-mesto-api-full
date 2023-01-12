const Card = require('../models/card');
const BadRequestError = require('../error/badReqErr');
const NotFoundError = require('../error/notFoundErr');
const ForbiddenError = require('../error/ForbiddenErr');

module.exports.getCard = (_, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send(cards.reverse()))
    .catch((err) => next(err));
};

module.exports.createCard = (req, res, next) => {
  console.log(req.user._id);
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании карточки.'));
        return;
      }
      next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError(`404 - Карточка с указанным _id ${req.params.cardId} не найдена`);
      }
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError('403 - Вы не можете удалить чужую карточку');
      }
      return card.remove();
    })
    .then(() => {
      res.send({ message: '200 - Карточка успешно удалена' });
    })
    .catch(next);
};

module.exports.changeLikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Передан несуществующий id карточки.'));
        return;
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        next(new BadRequestError('Переданы некорректные данные для постановки лайка.'));
        return;
      }
      next(err);
    });
};

module.exports.changeDislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Передан несуществующий id карточки.'));
        return;
      }

      res.send(card);
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        next(new BadRequestError('Переданы некорректные данные для снятии лайка.'));
        return;
      }
      next(err);
    });
};
