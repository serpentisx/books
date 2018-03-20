function checkTypeofString(str) {
  if (str) {
    return typeof str === 'string';
  }
  return true; // returns true if undefined or empty string
}

function validate({
  title, isbn13, author, description, category, published, pagecount, language,
} = {}) {
  const errors = [];

  if (!title || typeof title !== 'string') {
    errors.push({ field: 'title', message: 'Title must be a string and non-empty' });
  }

  if (!(typeof isbn13 === 'string' && isbn13.length === 13 && /^\d+$/.test(isbn13))) {
    errors.push({ field: 'isbn13', message: 'Isbn13 must be a string of 13 characters and digits only' });
  }

  if (!checkTypeofString(author)) {
    errors.push({ field: 'author', message: 'Author must be a string' });
  }

  if (!checkTypeofString(description)) {
    errors.push({ field: 'description', message: 'Description must be a string' });
  }

  if (!(typeof category === 'string' && category)) {
    errors.push({ field: 'category', message: 'Category must be a non-empty string' });
  }

  if (published) {
    if (!(checkTypeofString(published) && published.length <= 10)) {
      errors.push({ field: 'published', message: 'Publication date must be a string of length 1 - 10' });
    }
  }

  if (pagecount) {
    if (!(typeof pagecount === 'number' && pagecount > 0)) {
      errors.push({ field: 'published', message: 'Publication date must be a string of length 1 - 10' });
    }
  }

  if (language) {
    if (!(typeof language === 'string' && language.length === 2)) {
      errors.push({ field: 'language', message: 'Language must be a string of length 2' });
    }
  }

  return errors;
}

module.exports = {
  validate,
};
