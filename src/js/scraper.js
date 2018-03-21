const rp = require('request-promise');
const cheerio = require('cheerio');

async function getBook(isbn13) {
  const options = {
    uri: `https://www.bookdepository.com/search?searchTerm=${isbn13}&search=Find+book`,
    transform: (body) => {
      return cheerio.load(body);
    },
  };

  try {
    const $ = await rp(options);

    const listPrice = $('.list-price').text();
    let bsRank = $($('.biblio-info > li').last(), 'span').text().match(/\d/g);

    const imgUrl = $('.item-img-content img').attr('src') || './public/img/default.jpg';
    const price = $('.sale-price').text() || listPrice.substring(listPrice.search(/\d/), listPrice.length) || '-';
    bsRank = bsRank ? Number(bsRank.join('')) : -1;

    return { imgUrl, price, bsRank, isbn13 };
  } catch (error) {
    return null;
  }
}

module.exports = {
  getBook,
};
