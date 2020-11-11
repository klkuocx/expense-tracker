const express = require('express')
const router = express.Router()

const passport = require('passport')

// Facebook Login
router.get('/facebook', passport.authenticate('facebook', {
  scope: ['email', 'public_profile']
}))

router.get('/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/',
  failureRedirect: 'users/login',
  successFlash: true,
  failureFlash: true
}))

// Google Sign-in
router.get('/google', passport.authenticate('google', {
  scope: ['email', 'profile']
}))

router.get('/google/callback', passport.authenticate('google', {
  successRedirect: '/',
  failureRedirect: 'users/login',
  successFlash: true,
  failureFlash: true
}))

module.exports = router
