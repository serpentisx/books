require('dotenv').config();
const xss = require('xss');

const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL;

async function query(q, values = []) {
  const client = new Client({ connectionString });

  await client.connect();

  try {
    const cleanedData = values.map(data => xss(data))
    const result = await client.query(q, cleanedData);

    return result;
  } catch (err) {
    console.error('Error running query');
    throw err;
  } finally {
    await client.end();
  }
}

async function selectAllCategories(offset = 0, limit = 10) {
  const result = query('SELECT * FROM categories ORDER BY category OFFSET $1 LIMIT $2', [offset, limit]);

  return result.rows;
}

async function insertCategory(category) {
  const t = await query('INSERT INTO categories(category) VALUES($1) RETURNING *', [category]);

  return t.rows[0];
}

async function insertBook({
  title, ISBN13, author, description, category,
  ISBN0, datetime, pages, language,
} = {}) {
  const data = [title, ISBN13, author, description, category, ISBN0, datetime, pages, language];
  const t = await query('INSERT INTO books(title, ISBN13, author, description, category, ISBN0, datetime, pages, language) VALUES( $1, $2, $3, $4, $5, $6, $7, $8, $9 ) RETURNING *', data);

  return t.rows[0];
}

async function selectAll(table) {
  const t = await query('SELECT * FROM $1', [table]);

  return t.rows;
}


module.exports = {
  selectAllCategories,
  insertCategory,
  insertBook,
  selectAll,
};
