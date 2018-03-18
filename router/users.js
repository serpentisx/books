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

router.get('/users', catchErrors(showAllUsers));
router.get('/users/:id', catchErrors(showUser));
router.get('/users/me', catchErrors(showMe));
router.patch('/users/me', catchErrors(changeMyInfo));
router.post('/users/me/profile', catchErrors(setProfilePic));
router.get('/users/:id/read', catchErrors(getUserReadBooks));
router.get('/users/me/read', catchErrors(getMyreadBooks));
router.post('/users/me/read', catchErrors(readBook));
router.delete('/users/me/read/:id', catchErrors(deleteBook));

module.exports = router;
