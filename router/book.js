const express = require('express');
const validator = require('validator');

const router = express.Router();

const {
  insertCategory,
  insertBook,
  selectAll,
} = require('../queries/booksDb');

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
    isbn13: req.body.isbn13,
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

function catchErrors(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

router.get('/categories', catchErrors(showCategories));
router.post('/categories', catchErrors(createCategory));
router.get('/books', catchErrors(getBooks));
router.post('/books', catchErrors(createBook));
router.get('/books?search=query', catchErrors(searchBook));
router.get('/books/:id', catchErrors(getBookById));
router.patch('/books/:id', catchErrors(updateBook));

module.exports = router;
