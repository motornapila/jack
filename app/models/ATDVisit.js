var mongoose = require('mongoose');

var ATDVisitSchema = new mongoose.Schema({
	visit_date: { type: Date, required: true, default: Date.now }
});

module.exports = mongoose.module('atdvisit', ATDVisitSchema);