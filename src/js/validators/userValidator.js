function validate({
  name, username, password,
} = {}) {
  const errors = [];

  if (!(typeof name === 'string' && name)) {
    errors.push({ field: 'name', message: 'Name must be a non-empty string' });
  }

  if (!(typeof username === 'string' && username.length >= 3)) {
    errors.push({ field: 'username', message: 'Username must be a string of length 3 or greater' });
  }

  if (!password.toString().length >= 6) {
    errors.push({ field: 'password', message: 'Password must be of length 6 or greater' });
  }

  return errors;
}

module.exports = {
  validate,
};
