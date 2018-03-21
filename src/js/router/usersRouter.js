const express = require('express');
const usersDB = require('../queries/usersDb');
const bookDB = require('../queries/booksDb');
const bcrypt = require('bcrypt');
const val = require('../validators/userValidator');
const reviewVal = require('../validators/reviewValidator');

const router = express.Router();
const saltRounds = 10;

async function showAllUsers(req, res) {
  const lim = req.query.limit;
  const off = req.query.offset;
  const data = await usersDB.selectAllUsers(off, lim);
  res.json(data);
}

async function showUser(req, res) {
  const data = await usersDB.selectUserById(req.params.id);
  res.json(data);
}

async function showMe(req, res) {
  const data = await usersDB.selectUserById(req.user.id);
  res.json(data);
}

async function changeMyInfo(req, res) {
  const { name, password } = req.body;
  const errors = val.validate({
    name: (name || req.user.name), username: req.user.username, password: (password || req.user.password),
  });
  if (errors.length > 0) {
    return res.json(errors);
  }
  const passwordhash = await bcrypt.hash(password, saltRounds);
  const data = await usersDB.updateUserById(req.user.id, { name, passwordhash });

  return res.json(data);
}

async function setProfilePic(req, res) {
}

async function getUserReadBooks(req, res) {
  const { id } = req.params;
  const data = await bookDB.selectAllReviewsByUserId(id);
  res.json(data);
}

async function getMyReviews(req, res) {
  const data = await bookDB.selectAllReviewsByUserId(req.user.id);
  res.json(data);
}

async function postReview(req, res) {
  const { reviewTitle: title, reviewText: comment, rating } = req.body;
  const id = req.body.id || req.query.id;
  const errors = reviewVal.validate({
    title, rating,
  });

  if (errors.length > 0) {
    return res.json(errors);
  }
  await bookDB.insertReview({
    userid: req.user.id,
    bookid: id,
    title,
    review: comment,
    rating,
  });

  return res.redirect(`/books/${id}`);
}

async function deleteBook(req, res) {
  const data = await bookDB.deleteReviewById(req.params.id);
  res.json(data);
}

function catchErrors(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

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
