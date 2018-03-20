const express = require('express');
const validator = require('validator');
const bcrypt = require('bcrypt');
const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
const jwt = require('jsonwebtoken');
const userVal = require('../validators/userValidator');

const {
  PORT: port = 3000,
  JWT_SECRET: jwtSecret,
  TOKEN_LIFETIME: tokenLifetime = 20,
} = process.env;

if (!jwtSecret) {
  console.error('JWT_SECRET not registered in .env');
  process.exit(1);
}

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtSecret,
}

const saltRounds = 10;

const router = express.Router();

const {
  registerUser,
  getUserByUsername,
} = require('../queries/accountDb');

async function register(req, res) {
  const hash = await bcrypt.hash(req.body.password, saltRounds);
  const data = await registerUser({
    username: req.body.username,
    passwordhash: hash,
    name: req.body.name,
  });
  const dataWithoutPassword = { username: data.username, name: data.name };
  res.json(dataWithoutPassword);
}

async function login(req, res) {
  const { username, password } = req.body;
  const user = await getUserByUsername(username);
  if (user === undefined) {
    return res.status(401).json({ error: 'No such user' });
  }
  const c = await bcrypt.compare(password, user.passwordhash);
  if (c === true) {
    // skila token
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

module.exports = router;
