const express = require('express');

const accountRouter = require('./accountRouter');
const bookRouter = require('./bookRouter');
const indexRouter = require('./indexRouter');
const usersRouter = require('./usersRouter');
const { requireAuthentication } = require('../auth/auth');

const router = express.Router();

router.use('/', accountRouter);
router.use('/', indexRouter);
router.use('/', bookRouter);
router.use('/users', requireAuthentication, usersRouter);

module.exports = router;
