const mongoose = require('mongoose');

const TrackedUrlSchema = new mongoose.Schema({
  url: { type: String, required: true, unique: true },
  checkedAt: { type: Date, default: Date.now },
  productInfo: { type: Object },
});

module.exports = mongoose.model('TrackedUrl', TrackedUrlSchema); 