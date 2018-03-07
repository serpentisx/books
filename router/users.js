const express = require('express');
const validator = require('validator');

const router = express.Router();

async function showAllUsers(req, res) {
}

async function showUser(req, res) {
}

async function showMe(req, res) {
}

async function changeMyInfo(req, res) {
}

async function setProfilePic(req, res) {
}

async function getUserReadBooks(req, res) {
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