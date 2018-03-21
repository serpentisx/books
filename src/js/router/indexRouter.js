const express = require('express');
const bookDB = require('../queries/booksDb');

const router = express.Router();

async function loadContent(req, res) {
  const categories = await bookDB.selectAllCategories(0, 8);
  const bestsellers = await bookDB.selectBestSellersBooks(0, 14);
  const mostrecent = await bookDB.selectMostRecentBooks(0, 28);
  const trending = await bookDB.selectRandomBooks(0, 28);

  res.render('index', { categories, bestsellers, mostrecent, trending });
}

function catchErrors(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

router.get('/', catchErrors(loadContent));

module.exports = router;
