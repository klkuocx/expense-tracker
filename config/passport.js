const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')
module.exports = app => {
  // init Passport
  app.use(passport.initialize())
  app.use(passport.session())

  // Set LocalStrategy
  passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    User.findOne({ email })
      .then(user => {
        if (!user) {
          return done(null, false, { message: 'That email is not registered!' })
        }
        if (user.password !== password) {
          return done(null, false, { message: 'Email or Password incorrect.' })
        }
        return done(null, user, { message: `${user.name}, Welcome!` })
      })
      .catch(err => done(err, null))
  }))

  // serialize & deserialize
  passport.serializeUser((user, done) => {
    done(null, user._id)
  })
  passport.deserializeUser((_id, done) => {
    User.findById(_id)
      .lean()
      .then(user => done(null, user))
      .catch(err => done(err, null))
  })
}
