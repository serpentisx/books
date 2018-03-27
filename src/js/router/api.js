const express = require('express');

const accountRouter = require('./accountRouter');
const bookRouter = require('./bookRouter');
const usersRouter = require('./usersRouter');
const { requireAuthentication } = require('../auth/auth');

const router = express.Router();

router.use('/users', requireAuthentication, usersRouter);
router.use('/', accountRouter);
router.use('/', bookRouter);

module.exports = router;
