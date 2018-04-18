const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const val = require('../validators/userValidator');
const { insertNewUser, selectUserByUsername } = require('../queries/usersDb');
const { passport, jwtOptions } = require('../auth/auth');

const router = express.Router();
router.use(passport.initialize());

const saltRounds = 10;

async function register(req, res) {
  const { name, password, username } = req.body;
  const errors = val.validate({ name, password, username });

  if (errors.length > 0) {
    return res.json(errors);
  }

  const hash = await bcrypt.hash(req.body.password, saltRounds);
  const data = await insertNewUser({
    username: req.body.username,
    passwordhash: hash,
    name: req.body.name,
  });

  if (data.error === 'username taken') {
    return res.json(data);
  }
  const dataWithoutPassword = { username: data.username, name: data.name };

  return res.status(201).json(dataWithoutPassword);
}

async function login(req, res) {
  const { username, password } = req.body;
  const user = await selectUserByUsername(username);
  const pwMatch = user ? await bcrypt.compare(password, user.passwordhash) : null;

  if (!(user && pwMatch)) {
    return res.status(401).json({ error: 'Invalid password or username' });
  }

  const payload = { id: user.id };
  const tokenOptions = { expiresIn: parseInt(process.env.TOKEN_LIFETIME, 10) || 7200 };
  const token = jwt.sign(payload, jwtOptions.secretOrKey, tokenOptions);

  return res.json({ token, user: user.username });
}

function catchErrors(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

router.post('/register', catchErrors(register));
router.post('/login', catchErrors(login));

module.exports = router;

