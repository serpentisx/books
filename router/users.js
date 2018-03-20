const express = require('express');
const validator = require('validator');

const router = express.Router();

const {
  selectAllUsers,
  selectUserById,
  selectAllReviewsByUserId,
  insertReview,
  deleteReviewById,
} = require('../queries/usersDb');

const { requireAuthentication } = require('../router/account');


async function showAllUsers(req, res) {
  const data = await selectAllUsers();
  res.json(data);
}

async function showUser(req, res) {
  const data = await selectUserById();
  res.json(data);
}

async function showMe(req, res) {
}

async function changeMyInfo(req, res) {
}

async function setProfilePic(req, res) {
}

async function getUserReadBooks(req, res) {
  const { id } = req.params;
  const data = await selectAllReviewsByUserId(id);
  res.json(data);
}

async function getMyreadBooks(req, res) {
}

async function readBook(req, res) {
}

async function deleteBook(req, res) {
}

function catchErrors(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

router.get('/*', requireAuthentication, (req, res, next) => next());

router.get('/', requireAuthentication, catchErrors(showAllUsers));
router.get('/:id', catchErrors(showUser));
router.get('/me', catchErrors(showMe));
router.patch('/me', catchErrors(changeMyInfo));
router.post('/me/profile', catchErrors(setProfilePic));
router.get('/:id/read', catchErrors(getUserReadBooks));
router.get('/me/read', catchErrors(getMyreadBooks));
router.post('/me/read', catchErrors(readBook));
router.delete('/me/read/:id', catchErrors(deleteBook));

module.exports = router;
