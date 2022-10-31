var express = require('express');
var router = express.Router();
var Product = require('../models/Product');

/* GET users listing. */
router.get('/', (req, res, next) => {
  Product.find({}, (err, items) => {
    if (err) return next(err);
    res.render('user', { items });
  });
});

module.exports = router;
