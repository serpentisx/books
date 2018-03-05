require('dotenv').config();
const xss = require('xss');

const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL;

async function query(q, s) {
  const client = new Client({ connectionString });

  await client.connect();

  try {
    const result = await client.query(q, s);

    // const { rows } = result;
    return result;
  } catch (err) {
    console.error('Error running query');
    throw err;
  } finally {
    await client.end();
  }
}

async function insertCategory({ category } = {}) {
  const t = await query('INSERT INTO categories(category) VALUES($1) RETURNING *', [xss(category)]);
  return t.rows;
}

async function insertBook({
  title, ISBN13, author, description, category,
  ISBN0, datetime, pages, language,
} = {}) {
  const t = await query('INSERT INTO books(title, ISBN13, author, description, category, ISBN0, datetime, pages, language) VALUES( $1, $2, $3, $4, $5, $6, $7, $8, $9 ) RETURNING *', [xss(title), xss(ISBN13), xss(author), xss(description), xss(category), xss(ISBN0), xss(datetime), xss(pages), xss(language)]);
  return t.rows;
}

async function selectAll(table) {
  const t = await query('SELECT * FROM $1', [xss(table)]);
  return t.rows;
}


module.exports = {
  insertCategory,
  insertBook,
  selectAll,
};
