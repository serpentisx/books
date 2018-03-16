require('dotenv').config();

const xss = require('xss');
const { Client } = require('pg');
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({ connectionString });

async function query(q, values = []) {
  const client = new Client({ connectionString });
  await client.connect();

  try {
    const cleanedData = values.map(data => (typeof data === 'string' ? xss(data) : data));

    const result = await client.query(q, cleanedData);

    return result;
  } catch (err) {
    console.error('Error running query');
    throw err;
  } finally {
    await client.end();
  }
}

async function queryMany(q, values = []) {
  const client = await pool.connect();

  try {
    const cleanedData = values.map(data => (typeof data === 'string' ? xss(data) : data));
    const res = await client.query(q, cleanedData);

    return res;
  } catch (err) {
    console.error('Error running query on: ', values);
    throw err;
  } finally {
    await client.release();
  }
}

async function selectAllCategories(offset = 0, limit = 10) {
  const result = await query('SELECT * FROM categories ORDER BY category OFFSET $1 LIMIT $2', [offset, limit]);

  return result.rows;
}

async function selectCategoryById(id) {
  const result = await query('SELECT * FROM categories where id = $1', [id]);

  return result.rows[0].category;
}

async function insertCategory(category, client) {
  const t = await query('INSERT INTO categories(category) VALUES($1) RETURNING *', [category], client);

  return t.rows[0];
}

async function insertBook({
  title, isbn13, author, description, category, published, pagecount, language,
} = {}) {
  const res = await query('SELECT id FROM categories where category = $1', [category]);
  const categoryId = res.rows[0].id;
  const data = [title, author, description, isbn13, categoryId, published, pagecount, language];

  const t = await query('INSERT INTO books(title, author, description, isbn13, category, published, pagecount, language) VALUES( $1, $2, $3, $4, $5, $6, $7, $8) RETURNING *', data);

  return t.rows[0];
}

async function insertManyBooks({
  title, isbn13, author, description, category, published, pagecount, language,
} = {}) {
  const res = await queryMany('SELECT id FROM categories where category = $1', [category]);
  const categoryId = res.rows[0].id;
  const data = [title, author, description, isbn13, categoryId, published, pagecount, language];

  const t = await queryMany('INSERT INTO books(title, author, description, isbn13, category, published, pagecount, language) VALUES( $1, $2, $3, $4, $5, $6, $7, $8) RETURNING *', data);

  return t.rows[0];
}

async function insertExtraInfo(id, { imgUrl, price, bsRank }) {
  const t = await queryMany('UPDATE books SET imgUrl = $1, price = $2, bsRank = $3 WHERE id = $4 RETURNING *', [imgUrl, price, bsRank, id]);

  return t.rows[0];
}

async function selectAllBooks(offset = 0, limit = 10) {
  const t = await query('SELECT * FROM books ORDER BY title OFFSET $1 LIMIT $2', [offset, limit]);

  return t.rows;
}

async function selectBookById(id) {
  const t = await query('SELECT * FROM books where id = $1', [id]);

  return t.rows[0];
}

async function selectBestSellersBooks(offset = 0, limit = 10) {
  const result = await query('SELECT * FROM books WHERE bsrank > 0 ORDER BY bsrank OFFSET $1 LIMIT $2', [offset, limit]);

  return result.rows;
}

async function selectMostRecentBooks(offset = 0, limit = 10) {
  const result = await query('SELECT * FROM books ORDER BY published DESC OFFSET $1 LIMIT $2', [offset, limit]);

  return result.rows;
}

async function selectRandomBooks(offset = 0, limit = 10) {
  const result = await query('SELECT * FROM books ORDER BY random() OFFSET $1 LIMIT $2', [offset, limit]);

  return result.rows;
}

async function search(word) {
  const result = await query('SELECT * FROM books WHERE to_tsvector(title) @@ to_tsquery($1) OR to_tsvector(description) @@ to_tsquery($1)', [word]);
  return result.rows;
}

module.exports = {
  selectAllCategories,
  selectCategoryById,
  insertCategory,
  insertBook,
  selectAllBooks,
  selectBookById,
  insertExtraInfo,
  insertManyBooks,
  selectBestSellersBooks,
  selectMostRecentBooks,
  selectRandomBooks,
  query,
  search,
};
