const jwt = require('jsonwebtoken');
const AuthError = require('../error/authErr');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new AuthError('Необходима авторизация'));
    return;
  }

  const token = authorization.replace('Bearer ', ' ');
  console.log('token', token);
  let payload;

  try {
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    next(new AuthError('Необходима авторизация'));
    return;
  }

  // req.user = { _id: payload._id };

  req.user = payload;

  next();
};
