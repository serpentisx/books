const express = require('express');

const accountRouter = require('./accountRouter');
const bookRouter = require('./bookRouter');
const indexRouter = require('./indexRouter');
const usersRouter = require('./usersRouter');
const { requireAuthentication, verifyToken } = require('../auth/auth');

const router = express.Router();

router.use('/*', (req, res, next) => {
  req.headers.authorization = `bearer ${req.cookies.userToken}`;
  next();
});

router.use('/users', requireAuthentication, usersRouter);
router.use('/*', verifyToken);
router.use('/', accountRouter);
router.use('/', indexRouter);
router.use('/', bookRouter);

module.exports = router;
