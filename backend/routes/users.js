const userRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { linkValidate } = require('../constans/constans');
const {
  getProfile, getPosts, getProfileId, editProfile, editAvatar,
} = require('../controllers/users');

userRouter.get('/', getProfile);
userRouter.get('/users/me', getPosts);

userRouter.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().required().length(24),
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
