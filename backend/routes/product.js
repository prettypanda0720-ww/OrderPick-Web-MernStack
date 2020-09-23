var express = require('express');
var fs = require('fs');
let config = require('../config/config');
var app = express();
// var router = express.Router();
var mongoose = require('mongoose');
var Product = require('../models/Product.js');
const { serverUrl } = require('../config/config');

/* GET ALL BOOKS */
app.get('/', function(req, res, next) {
  Product.find(function(err, products) {
    if (err) return next(err);
    res.json(products);
  });
});

/* GET SINGLE BOOK BY ID */
app.get('/:id', function(req, res, next) {
  Product.findById(req.params.id, function(err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* SAVE BOOK */
app.post('/', function(req, res, next) {
  Product.create(req.body, function(err, post) {
    if (err) return next(err);
    var result = {
      status: 'success',
      message: 'Product is successfully created!'
    };
    res.json(result);
  });
});

/* UPDATE BOOK */
app.put('/:id', function(req, res, next) {
  Product.findByIdAndUpdate(req.params.id, req.body, function(err, post) {
    if (err) return next(err);
    var result = {
      status: 'success',
      message: 'Product is successfully updated!'
    };
    res.json(result);
  });
});

/* DELETE BOOK */
app.delete('/:id', function(req, res, next) {
  Product.findByIdAndRemove(req.params.id, req.body, function(err, post) {
    if (err) return next(err);
    var result = {
      status: 'success',
      message: 'Product is successfully deleted!'
    };
    res.json(result);
  });
});

module.exports = app;
