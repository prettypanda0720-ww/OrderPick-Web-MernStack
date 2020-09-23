var mongoose = require('mongoose');

var ProductSchema = new mongoose.Schema({
  name: String,
  name_su: String,
  price: String,
  description: String,
  image: {
    type: String
  },
  filename: String,
  category: String,
  updated_date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Product', ProductSchema);
