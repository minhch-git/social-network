const passport = require('passport')
const createHttpError = require('http-errors')

const protect = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err || info || !user)
      return next(new createHttpError.Unauthorized('Please authenticate.'))
    req.user = user
    next()
  })(req, res, next)
}

const auth =
  (...roles) =>
  (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
      if (err || info || !user)
        return next(new createHttpError.Unauthorized('Please authenticate.'))
      req.user = user

      if (roles.length > 0 && !roles.includes(req.user.role)) {
        return next(
          createHttpError.Forbidden(
            `User role ${req.user.role} is not authorized to access this route`
          )
        )
      }
      next()
    })(req, res, next)
  }

// req.isAuthenticated: will return true if user is logged in
const requireLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  return res.redirect('/auth/login')
}

const requireLoggedOut = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next()
  }
  return res.redirect('/')
}

export { auth, protect, requireLoggedIn, requireLoggedOut }
export default protect
