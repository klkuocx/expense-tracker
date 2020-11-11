const bcrypt = require('bcryptjs')
const User = require('../models/user')

module.exports = {
  thirdPartyLogin: (accessToken, refreshToken, profile, done) => {
    const { name, email } = profile._json
    User.findOne({ email })
      .then(user => {
        if (user) return done(null, user, { message: `${user.name}, Welcome!` })
        const randomPassword = Math.random().toString(36).slice(-8)
        bcrypt.genSalt(10)
          .then(salt => bcrypt.hash(randomPassword, salt))
          .then(hash => User.create({ name, email, password: hash }))
          .then(user => done(null, user, { message: `${user.name}, Welcome!` }))
          .catch(err => done(err, null))
      })
  }
}
