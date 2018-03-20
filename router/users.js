const express = require('express');
const validator = require('validator');
const usersDB = require('../queries/usersDb');
const bcrypt = require('bcrypt');
const val = require('../validators/userValidator');

const router = express.Router();

const saltRounds = 10;

const {
  selectAllUsers,
  selectUserById,
  selectAllReviewsByUserId,
  insertReview,
  deleteReviewById,
  updateUserById,
} = require('../queries/usersDb');

const { requireAuthentication } = require('../router/account');


async function showAllUsers(req, res) {
  const data = await selectAllUsers();
  res.json(data);
}

async function showUser(req, res) {
  const data = await selectUserById(req.params.id);
  res.json(data);
}

async function showMe(req, res) {
  const data = await selectUserById(req.user.id);
  res.json(data);
}

async function changeMyInfo(req, res) {
  const { name, password } = req.body;

  const errors = val.validate({ name, password, username: req.user.username });
  if (errors.length > 0) {
    return res.json(errors);
  }

  const passwordhash = await bcrypt.hash(password, saltRounds);
  const data = await updateUserById(req.user.id, { name, passwordhash });
  return res.json(data);
}

async function setProfilePic(req, res) {
}

async function getUserReadBooks(req, res) {
  const { id } = req.params;
  const data = await selectAllReviewsByUserId(id);
  res.json(data);
}

async function getMyReviews(req, res) {

}

async function postReview(req, res) {
  const { reviewTitle: title, reviewText: comment, rating } = req.body;
  await usersDB.insertReview({ userid: req.user.id, bookid: req.query.id, title, comment, rating });

  return res.redirect(`/books/${req.query.id}`);
}

async function deleteBook(req, res) {
}

function catchErrors(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

router.use('/*', requireAuthentication, (req, res, next) => next());

router.get('/', catchErrors(showAllUsers));
router.get('/me', catchErrors(showMe));
router.get('/:id', catchErrors(showUser));
router.patch('/me', catchErrors(changeMyInfo));
router.post('/me/profile', catchErrors(setProfilePic));
router.get('/me/read', catchErrors(getMyReviews));
router.post('/me/read', catchErrors(postReview));
router.delete('/me/read/:id', catchErrors(deleteBook));
router.get('/:id/read', catchErrors(getUserReadBooks));

module.exports = router;
