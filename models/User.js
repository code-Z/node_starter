var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  email: String,
  password: String,
  hotels: { type: mongoose.Schema.Types.Mixed, default: [] }
});

module.exports = mongoose.model('User', userSchema);
