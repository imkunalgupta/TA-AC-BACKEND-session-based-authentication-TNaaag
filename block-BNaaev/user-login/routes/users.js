var express = require('express');
const user = require('../models/user');
var router = express.Router();
var User = require('../models/user');
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('users');
});

router.get('/register', function (req, res, next) {
  res.render('register');
});

router.post('/register', function (req, res, next) {
  user.create(req.body, (err, user) => {
    if (err) return next(err);
    res.redirect('/users/login');
  });
});

router.get('/login', function (req, res, next) {
  res.render('login');
});

module.exports = router;
