const jwt = require('jsonwebtoken');
const redis = require('redis');

// Setup Redis
const redisClient = redis.createClient(process.env.REDIS_URI);

const handleSignin = async (db, bcrypt, req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new Error('incorrect form submission');
  }

  try {
    const data = await db
      .select('email', 'hash')
      .from('login')
      .where('email', '=', email);

    const isValid = bcrypt.compareSync(password, data[0].hash);

    if (isValid) {
      try {
        const user = await db
          .select('*')
          .from('users')
          .where('email', '=', email);

        return user[0];
      } catch (err) {
        throw new Error('unable to get user');
      }
    } else {
      throw new Error('wrong credentials');
    }
  } catch (err) {
    throw new Error('error getting user from db');
  }
};

const signToken = (email) => {
  const jwtPayload = { email };
  return jwt.sign(jwtPayload, process.env.JWT_SECRET, { expiresIn: '2 days' });
};

const setToken = async (token, id) => {
  await redisClient.set(token, id);
};

const createSessions = async (user) => {
  const { email, id } = user;
  const token = signToken(email);
  try {
    await setToken(token, id);
    return { success: 'true', userId: id, token };
  } catch (err) {
    throw new Error('session error:', err);
  }
};

const getAuthTokenId = (req, res) => {
  const { authorization } = req.headers;
  return redisClient.get(authorization, (err, reply) => {
    if (err || !reply) {
      return res.status(400).json('Unauthorized');
    }
    return res.json({ success: 'true', userId: reply });
  });
};

const signInAuthentication = (db, bcrypt) => async (req, res) => {
  const { authorization } = req.headers;

  if (authorization) {
    return getAuthTokenId(req, res);
  }

  try {
    const data = await handleSignin(db, bcrypt, req, res);
    let session = '';

    if (data.id && data.email) {
      session = await createSessions(data);
      res.json(session);
    } else {
      throw new Error('auth error');
    }
  } catch (err) {
    res.status(400).json(err);
  }
};

module.exports = {
  signInAuthentication: signInAuthentication,
  redisClient: redisClient,
};
