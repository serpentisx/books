function validate({ title, rating } = {}) {
  const errors = [];

  if (!title) {
    errors.push({ field: 'title', message: 'Title is required' });
  }

  if (!(/^\d+$/.test(rating) && rating >= 1 && rating <= 5)) {
    errors.push({ field: 'rating', message: 'Rating must be a number between 1 - 5' });
  }

  return errors;
}

module.exports = {
  validate,
};
