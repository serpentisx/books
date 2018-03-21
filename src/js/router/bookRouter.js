const express = require('express');
const bookDB = require('../queries/booksDb');
const val = require('../validators/bookValidator');

const router = express.Router();

const {
  insertCategory,
  insertBook,
  selectAllBooks,
  selectAllCategories,
  search,
  updateBook,
} = require('../queries/booksDb');

async function showCategories(req, res) {
  const lim = req.query.limit;
  const off = req.query.offset;
  const data = await selectAllCategories(off, lim);
  res.json(data);
}

async function createCategory(req, res) {
  const data = await insertCategory({ category: req.body.category });
  res.json(data);
}

async function getBooks(req, res) {
  const lim = req.query.limit;
  const off = req.query.offset;
  if (req.query.search != null) {
    const data = await search(req.query.search, off, lim);
    res.json(data);
  } else {
    const data = await selectAllBooks(off, lim);
    res.json(data);
  }
}

async function createBook(req, res) {
  const {
    title, isbn13, author,
    description, category,
    ISBN10, datetime, pages,
    language,
  } = req.body;
  const errors = val.validate({
    title, isbn13, author, description, category, ISBN10, datetime, pages, language,
  });

  if (errors.length > 0) {
    return res.json(errors);
  }

  const data = await insertBook({
    title, isbn13, author, description, category, ISBN10, datetime, pages, language,
  });
  return res.json(data);
}

async function getBookById(req, res) {
  const { id } = req.params;
  const book = await bookDB.selectBookById(id);
  book.category = await bookDB.selectCategoryById(book.category);

  res.render('bookPage', { book, id });
}

async function updateBookInfo(req, res) {
  const {
    title, isbn13, author,
    description, category,
    ISBN10, datetime, pages,
    language,
  } = req.body;
  const errors = val.validate({
    title, isbn13, author, description, category, ISBN10, datetime, pages, language,
  });

  if (errors.length > 0) {
    return res.json(errors);
  }
  const { id } = req.params;
  const data = await updateBook({
    title, isbn13, author, description, category, ISBN10, datetime, pages, language, id,
  });
  return res.json(data);
}

function catchErrors(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

router.get('/categories', catchErrors(showCategories));
router.post('/categories', catchErrors(createCategory));
router.get('/books', catchErrors(getBooks));
router.post('/books', catchErrors(createBook));
router.get('/books/:id', catchErrors(getBookById));
router.patch('/books/:id', catchErrors(updateBookInfo));

module.exports = router;
