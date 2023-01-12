const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../error/badReqErr');
const NotFoundError = require('../error/notFoundErr');
const ConflictError = require('../error/conflictErr');
const AuthError = require('../error/authErr');

module.exports.getProfile = (_, res, next) => {
  User.find({})
    .then((user) => {
      res.send({ user });
    })
    .catch((err) => next(err));
};

module.exports.getPosts = (req, res, next) => {
  User.findById(req.user)
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь по указанному id не найден.'));
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Пользователь по указанному id не найден.'));
        return;
      }
      next(err);
    });
};

module.exports.getProfileId = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь по указанному id не найден.'));
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Пользователь по указанному id не найден.'));
        return;
      }
      next(err);
    });
};

module.exports.createProfile = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash, // записываем хеш в базу
    }))
    .then((user) => res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя.'));
        return;
      }
      if (err.code === 11000) {
        next(new ConflictError('Такой пользователь уже существует!'));
        return;
      }
      next(err);
    });
};
module.exports.editProfile = (req, res, next) => {
  const { name, about } = req.body;
  if (!name || !about) {
    next(new NotFoundError('Переданы некорректные данные при обновлении профиля.'));
    return;
  }

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении профиля.'));
        return;
      }
      next(err);
    });
};

module.exports.editAvatar = (req, res, next) => {
  const { avatar } = req.body;
  if (!avatar) {
    next(new NotFoundError('Переданы некорректные данные при обновлении аватара.'));
    return;
  }

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении аватара.'));
        return;
      }
      next(err);
    });
};
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // создадим токен
      const token = jwt.sign(
        { _id: user._id },
        'some-secret-key',
        { expiresIn: '7d' }, // токен будет просрочен через 7 дней после создания
      );

      // вернём токен
      res.send({ token });
    })
    .catch((err) => next(new AuthError(err.message)));
};
