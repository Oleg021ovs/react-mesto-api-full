const allowedCors = [
  'http://oleg021mesto.nomoredomains.club',
  'https://oleg021mesto.nomoredomains.club',
  'http://www.oleg021mesto.nomoredomains.club',
  'https://www.oleg021mesto.nomoredomains.club',
  'https://api.oleg021mesto.nomoredomains.work',
  'http://api.oleg021mesto.nomoredomains.work',
  'http://localhost:3000',
  'http://localhost:3001',
];

const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

module.exports = (req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;
  const requestHeaders = req.headers['access-control-request-headers'];

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);

    if (method === 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
      res.header('Access-Control-Allow-Headers', requestHeaders);
      res.end();
    }
  }
  next();
};
