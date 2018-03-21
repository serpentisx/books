const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
const { selectUserByIdAlternate: findUserById } = require('../queries/usersDb');

const { JWT_SECRET: jwtSecret } = process.env;

if (!jwtSecret) {
  console.error('JWT_SECRET not registered in .env');
  process.exit(1);
}

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtSecret,
};

async function strat(data, next) {
  const user = await findUserById(data.id);

  if (user) {
    next(null, user);
  } else {
    next(null, false);
  }
}

passport.use(new Strategy(jwtOptions, strat));

function requireAuthentication(req, res, next) {
  req.headers.authorization = `bearer ${req.cookies.userToken}`;

  return passport.authenticate(
    'jwt',
    { session: false },
    (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        const error = info.name === 'TokenExpiredError' ? 'expired token' : 'invalid token';
        return res.status(401).json({ error });
      }
      req.user = user;
      return next();
    },
  )(req, res, next);
}

module.exports = {
  passport,
  requireAuthentication,
  jwtOptions,
};

