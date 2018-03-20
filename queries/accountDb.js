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
  imagepath,
} = {}) {
  const data = [xss(username), xss(passwordhash), xss(name), xss(imagepath)];
  const result = query('INSERT INTO users(username, passwordhash, name, imagepath) VALUES($1, $2, $3, $4) RETURNING *', data);

  return result.rows[0];
}

module.exports = {
  registerUser,
};
