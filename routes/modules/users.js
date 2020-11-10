const express = require('express')
const router = express.Router()

const passport = require('passport')
const bcrypt = require('bcryptjs')

const User = require('../../models/user')

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login',
  successFlash: true,
  failureFlash: true
}))

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body
  const errors = []

  // handle errors situation
  if (!name || !email || !password || !confirmPassword) {
    errors.push({ message: 'All fields are required.' })
  }
  if (password !== confirmPassword) {
    errors.push({ message: 'Your password and confirmation password do not match.' })
  }
  if (errors.length) {
    return res.render('register', { errors, name, email, password, confirmPassword })
  }

  User.findOne({ email }).then(user => {
    if (user) {
      errors.push({ message: 'This email address is already registered.' })
      return res.render('register', { errors, name, email, password, confirmPassword })
    }
    return bcrypt.genSalt(10)
      .then(salt => bcrypt.hash(password, salt))
      .then(hash => User.create({ name, email, password: hash }))
      .then(() => next())
      .catch(err => console.log(err))
  })
}, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login',
  successFlash: true,
  failureFlash: true
}))

router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', 'Logged out successfully.')
  res.redirect('/users/login')
})

module.exports = router
