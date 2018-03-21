require('dotenv').config();
const xss = require('xss');


const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL;

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

async function selectAllUsers(offset = 0, limit = 10) {
  const result = await query('SELECT id, username, name, imagepath FROM users ORDER BY name OFFSET $1 LIMIT $2', [offset, limit]);

  return { LIMIT: limit, OFFSET: offset, items: result.rows };
}

async function selectUserById(id) {
  const result = await query('SELECT id, username, name, imagepath FROM users WHERE id = $1', [id]);

  return result.rows[0];
}

async function updateUserById(id, { name, passwordhash } = {}) {
  const result = await query('UPDATE users SET name = $2, passwordhash = $3 WHERE id = $1 RETURNING *', [id, name, passwordhash]);

  return result.rows[0];
}

async function insertNewUser({ username, passwordhash, name } = {}) {
  const data = [username, passwordhash, name];
  const count = await query('SELECT username FROM users WHERE username = $1', [username]);
  let result = '';
  if (count.rowCount === 0) {
    result = await query('INSERT INTO users(username, passwordhash, name) VALUES($1, $2, $3) RETURNING *', data);
    return result.rows[0];
  }

  return { error: 'username taken' };
}

async function selectUserByUsername(username) {
  const result = await query('SELECT * FROM users WHERE username = $1', [username]);
  return result.rows[0];
}

module.exports = {
  selectAllUsers,
  selectUserById,
  updateUserById,
  insertNewUser,
  selectUserByUsername,
};
