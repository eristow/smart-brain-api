const redisClient = require('./signin').redisClient;

const requireAuth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json('Unauthorized');
  }

  const bearer = authorization.split(' ');
  const bearerToken = bearer[1];

  return redisClient.get(bearerToken, (err, reply) => {
    if (err || !reply) {
      return res.status(401).json('Unauthorized');
    }
    console.log('passed auth');
    return next();
  });
};

module.exports = {
  requireAuth: requireAuth,
};
