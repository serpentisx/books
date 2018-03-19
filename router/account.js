const express = require('express');
const validator = require('validator');

const router = express.Router();

async function register(req, res) {
  /* const data = await registerUser({ username: req.body.username, passwordhash: req.body.password, name: req.body.name, imagepath: req.body.imagepath});
  res.json(data); */
}

async function login(req, res) {
}

function catchErrors(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

router.post('/register', catchErrors(register));
router.post('/login', catchErrors(login));

module.exports = router;
