const express = require('express');

const val = require('validator');

const {
  insertCategory,
  insertBook,
  selectAll,
} = require('./queries');

const router = express.Router();

async function register(req, res) {
}

async function login(req, res) {
}

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

async function showCategories(req, res) {
}

async function createCategory(req, res) {
  const data = await insertCategory({ category: req.body.category });
  res.json(data);
}

async function getBooks(req, res) {
  const data = await selectAll('books');
  res.json(data);
}

async function createBook(req, res) {
  const data = await insertBook({
    title: req.body.title,
    ISBN13: req.body.isbn13,
    author: req.body.author,
    description: req.body.description,
    category: req.body.category,
    ISBN10: req.body.isbn10,
    datetime: req.body.published,
    pages: req.body.pagecount,
    language: req.body.language,
  });
  res.json(data);
}

async function searchBook(req, res) {
}

async function getBookById(req, res) {
}

async function updateBook(req, res) {
}

async function getUserReadBooks(req, res) {
}

async function getMyreadBooks(req, res) {
}

async function readBook(req, res) {
}

async function deleteBook(req, res) {
}

router.post('/register', register);
router.post('/login', login);
router.get('/users', showAllUsers);
router.get('/users/:id', showUser);
router.get('/users/me', showMe);
router.patch('/users/me', changeMyInfo);
router.post('/users/me/profile', setProfilePic);
router.get('/categories', showCategories);
router.post('/categories', createCategory);
router.get('/books', getBooks);
router.post('/books', createBook);
router.get('/books?search=query', searchBook);
router.get('/books/:id', getBookById);
router.patch('/books/:id', updateBook);
router.get('/users/:id/read', getUserReadBooks);
router.get('/users/me/read', getMyreadBooks);
router.post('/users/me/read', readBook);
router.delete('/users/me/read/:id', deleteBook);

module.exports = router;
