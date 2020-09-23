var mongoose = require('mongoose');

var ProductSchema = new mongoose.Schema({
  name: String,
  price: String,
  description: String,
  image_url: String,
  image_content: String,
  updated_date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Product', ProductSchema);
