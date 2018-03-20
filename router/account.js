const express = require('express');
const validator = require('validator');

const router = express.Router();

const {
  registerUser,
} = require('../queries/accountDb');

async function register(req, res) {
  /*
  hash req.body.password here
  */
  const data = await registerUser({
    username: req.body.username,
    passwordhash: hashedPassword,
    name: req.body.name,
    imagepath: req.body.imagepath,
  });
  res.json(data);
}

async function login(req, res) {
}

function catchErrors(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

router.post('/register', catchErrors(register));
router.post('/login', catchErrors(login));

module.exports = router;
