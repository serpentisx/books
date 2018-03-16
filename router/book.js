const express = require('express');
const validator = require('validator');
const bookDB = require('../queries/booksDb');

const router = express.Router();

const {
  insertCategory,
  insertBook,
  selectAllBooks,
  selectAllCategories,
  search,
} = require('../queries/booksDb');

async function showCategories(req, res) {
  const data = await selectAllCategories();
  res.json(data);
}

async function createCategory(req, res) {
  const data = await insertCategory({ category: req.body.category });
  res.json(data);
}

async function getBooks(req, res) {
  const data = await selectAllBooks();
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
  const data = await search(req.query.search);
  res.json(data);
}

async function getBookById(req, res) {
  const { id } = req.params;
  const book = await bookDB.selectBookById(id);
  book.category = await bookDB.selectCategoryById(book.category);

  res.render('bookPage', { book });
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
