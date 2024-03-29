const userRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { linkValidate } = require('../constans/constans');
const {
  getProfile, getPosts, editProfile, editAvatar, getProfileId,
} = require('../controllers/users');

userRouter.get('/', getProfile);
userRouter.get('/me', getPosts);
userRouter.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().required().length(24),
  }),
}), getProfileId);

userRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), editProfile);

userRouter.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(linkValidate),
  }),
}), editAvatar);

module.exports = userRouter;
