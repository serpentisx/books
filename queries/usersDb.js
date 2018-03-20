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

  return result.rows;
}

async function selectUserById(id) {
  const result = await query('SELECT id, username, name, imagepath FROM users WHERE id = $1', [id]);

  return result.rows[0];
}

async function updateUserById(id, { name, passwordhash } = {}) {
  const result = await query('UPDATE users SET name = $2, passwordhash = $3 WHERE id = $1 RETURNING *', [id, name, passwordhash]);

  return result.rows[0];
}

async function selectAllReviewsByUserId(id, offset = 0, limit = 10) {
  const result = await query('SELECT * FROM review WHERE userid = $1 ORDER BY bookid OFFSET $2 LIMIT $3', [id, offset, limit]);

  return result.rows;
}

async function insertReview({ userid, bookid, title, rating, review } = {}) {
  const data = [userid, bookid, title, rating, review];
  const result = await query('INSERT INTO review(userid, bookid, title, rating, review) VALUES($1, $2, $3, $4, $5) RETURNING *', data);

  return result.rows[0];
}

async function deleteReviewById(id) {
  const result = await query('DELETE FROM review where id = $1', [id]);

  return result.rowCount === 1;
}


module.exports = {
  selectAllUsers,
  selectUserById,
  selectAllReviewsByUserId,
  deleteReviewById,
<<<<<<< HEAD
  insertReview,
=======
  updateUserById,
>>>>>>> fc8021886e078cee805751aa2eeafbec0ab4ab49
};
