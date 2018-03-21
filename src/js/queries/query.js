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

module.exports = {
  query,
  queryMany,
};
