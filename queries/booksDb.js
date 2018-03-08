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
    const cleanedData = values.map(data => xss(data));
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
    const cleanedData = values.map(data => xss(data));
    const res = await client.query(q, cleanedData);

    return res;
  } catch (err) {
    console.error('Error running query on: ', values);
  } finally {
    client.release();
  }
}

async function selectAllCategories(offset = 0, limit = 10) {
  const result = query('SELECT * FROM categories ORDER BY category OFFSET $1 LIMIT $2', [offset, limit]);

  return result.rows;
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

async function selectAllBooks() {
  const t = await query('SELECT * FROM books');

  return t.rows;
}

module.exports = {
  selectAllCategories,
  insertCategory,
  insertBook,
  selectAllBooks,
  insertExtraInfo,
  insertManyBooks,
  query,
};
