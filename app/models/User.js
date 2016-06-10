var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
	username: String,
	password: String,
	department: String,
	role: String
});

module.exports = mongoose.model('User', UserSchema);