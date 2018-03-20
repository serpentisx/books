const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
const jwt = require('jsonwebtoken');
const userAuth = require('../userAuth');
const val = require('../validators/userValidator');

const router = express.Router();

const {
  registerUser,
  getUserByUsername,
} = require('../queries/accountDb');

const {
  JWT_SECRET: jwtSecret,
  TOKEN_LIFETIME: tokenLifetime = 60000,
} = process.env;

if (!jwtSecret) {
  console.error('JWT_SECRET not registered in .env');
  process.exit(1);
}

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtSecret,
};

async function strat(data, next) {
  const user = await userAuth.findById(data.id);

  if (user) {
    next(null, user);
  } else {
    next(null, false);
  }
}

passport.use(new Strategy(jwtOptions, strat));
router.use(passport.initialize());

const saltRounds = 10;

function requireAuthentication(req, res, next) {
  return passport.authenticate(
    'jwt',
    { session: false },
    (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        const error = info.name === 'TokenExpiredError' ? 'expired token' : 'invalid token';
        return res.status(401).json({ error });
      }
      req.user = user;
      return next();
    },
  )(req, res, next);
}

async function register(req, res) {
  const { name, password, username } = req.body;
  const errors = val.validate({ name, password, username });
  if (errors.length > 0) {
    return res.json(errors);
  }

  const hash = await bcrypt.hash(req.body.password, saltRounds);
  const data = await registerUser({
    username: req.body.username,
    passwordhash: hash,
    name: req.body.name,
  });
  console.log(data.error);
  if (data.error === 'username taken') {
    return res.json(data);
  }
  const dataWithoutPassword = { username: data.username, name: data.name };
  return res.json(dataWithoutPassword);
}

async function login(req, res) {
  const { username, password } = req.body;
  const user = await getUserByUsername(username);
  if (user === undefined) {
    return res.status(401).json({ error: 'No such user' });
  }
  const c = await bcrypt.compare(password, user.passwordhash);
  if (c === true) {
    const payload = { id: user.id };
    const tokenOptions = { expiresIn: tokenLifetime };
    const token = jwt.sign(payload, jwtOptions.secretOrKey, tokenOptions);

    return res.json({ token });
  }
  return res.status(401).json({ error: 'Invalid password' });
}

function catchErrors(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

router.post('/register', catchErrors(register));
router.post('/login', catchErrors(login));

module.exports = {
  router,
  requireAuthentication,
};

