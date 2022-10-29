var express = require('express');
const user = require('../models/user');
var router = express.Router();
var User = require('../models/user');

/* GET users listing. */
router.get('/', function (req, res, next) {
  console.log(req.session);
  res.render('users');
});

router.get('/register', function (req, res, next) {
  var error = req.flash('error')[0];
  res.render('register', { error: error });
});

router.post('/register', (req, res, next) => {
  User.create(req.body, (err, user) => {
    if (err) {
      if (err.code === 11000) {
        req.flash('error', 'Add a unique email!');
        return res.redirect('/users/register');
      }
      if (err.name === 'ValidatorError') {
        req.flash('error', 'err.message');
        return res.redirect('/users/register');
      }
      return res.json({ err });
    }
    res.redirect('/users/login');
  });
});

router.get('/login', function (req, res, next) {
  var error = req.flash('error')[0];
  console.log(error);
  res.render('login', { error: error });
});

router.post('/login', function (req, res, next) {
  var { email, password } = req.body;
  if (!email || !password) {
    req.flash('error', 'Email/Password required');
    return res.redirect('/users/login');
  }
  User.findOne({ email }, (err, user) => {
    if (err) return next(err);
    //no user
    if (!user) {
      req.flash('error', 'Email is not  valid');
      return res.redirect('/users/login');
    }
    //user then compare password
    user.verifyPassword(password, (err, result) => {
      if (err) return next(err);
      if (!result) {
        req.flash('error', 'Incorrect Password');
        return res.redirect('/users/login');
      }
      //persist logged in user information
      req.session.userId = user.id;
      res.redirect('/users');
    });
  });
});
//logout router
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.clearCookie('connect.sid');
  res.redirect('/users/login');
});
module.exports = router;
