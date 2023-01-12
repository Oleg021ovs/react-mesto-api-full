const cardsRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { linkValidate } = require('../constans/constans');
const {
  getCard,
  createCard,
  deleteCard,
  changeLikeCard,
  changeDislikeCard,
} = require('../controllers/cards');

cardsRouter.get('/', getCard);
// cardsRouter.post('/', createCard);
cardsRouter.post(
  '/cards',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().pattern(linkValidate),
    }),
  }),
  createCard,
);
// cardsRouter.delete('/:cardId', deleteCard);
cardsRouter.delete(
  '/:cardId',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().alphanum().required().length(24),
    }),
  }),
  deleteCard,
);
// cardsRouter.put('/:cardId/likes', changeLikeCard);
cardsRouter.put(
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().alphanum().required().length(24),
    }),
  }),
  changeLikeCard,
);
// cardsRouter.delete('/:cardId/likes', changeDislikeCard);
cardsRouter.delete(
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().alphanum().required().length(24),
    }),
  }),
  changeDislikeCard,
);

module.exports = cardsRouter;
