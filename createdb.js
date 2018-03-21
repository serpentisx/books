require('dotenv').config();

const parse = require('csv-parse/lib/sync');
const fs = require('fs');
const util = require('util');
const cloudinary = require('cloudinary');
const bookDb = require('./src/js/queries/booksDb');
const scraper = require('./src/js/scraper');

const readFileAsync = util.promisify(fs.readFile);

const CLOUDINARY_API = process.env.CLOUDINARY_URL;
const csvFilePath = './src/data/books.csv';
const categoriesSet = new Set();

cloudinary.config({ CLOUDINARY_API });

async function createDbFromCSV() {
  const data = await readFileAsync(csvFilePath);
  const output = parse(data.toString('utf-8'), { columns: true });

  const categories = [];

  output.forEach((book) => {
    if (!categoriesSet.has(book.category)) {
      categoriesSet.add(book.category);
      categories.push(bookDb.insertCategory(book.category));
    }
  });

  Promise.all(categories)
    .then(() => {
      console.info('Done inserting categories...');
      console.info('Inserting books...');

      output.forEach((b) => {
        const book = b;
        book.pagecount = Number(b.pagecount) || -1;
        bookDb.insertManyBooks(book);
      });
    });
}

async function getExtraInfo() {
  const books = await bookDb.query('SELECT * FROM books where imgurl IS NULL');
  console.info(`Trying to scrape for: ${books.rows.length} books`);

  books.rows.forEach((b) => {
    setTimeout(() => {
      scraper.getBook(b.isbn13)
        .then((data) => {
          if (data) {
            cloudinary.uploader.upload(data.imgUrl, (res) => {
              const result = { imgUrl: res.url, bsRank: data.bsRank, price: data.price };
              bookDb.insertExtraInfo(b.id, result)
                .then(() => console.info('Done', b.id))
                .catch(() => 'Error running query for ', b.id);
            }, { public_id: data.isbn13 });
          } else {
            console.error('Error scraping on: ', b.isbn13);
          }
        }).catch(err => console.error(err));
    }, 400);
  });
}

createDbFromCSV();
// getExtraInfo();

module.exports = {
  createDbFromCSV,
  getExtraInfo,
};
