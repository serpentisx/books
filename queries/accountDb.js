require('dotenv').config();
const xss = require('xss');

const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL;

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

async function registerUser({
  username,
  passwordhash,
  name,
} = {}) {
  const data = [username, passwordhash, name];
  const count = await query('SELECT username FROM users WHERE username = $1', [username]);
  let result = '';
  if (count.rowCount === 0) {
    result = await query('INSERT INTO users(username, passwordhash, name) VALUES($1, $2, $3) RETURNING *', data);
  }
  return result.rows[0];
}

async function getUserByUsername(username) {
  const result = await query('SELECT * FROM users WHERE username = $1', [username]);
  return result.rows[0];
}

module.exports = {
  registerUser,
  getUserByUsername,
};
