var mongoose = require('mongoose');

var ATDVisitSchema = new mongoose.Schema({
	visit_date: { type: Date, required: true, default: Date.now }
});

var ATDChartSchema = new mongoose.Schema({
	chart_number: { type: Number, required: true },
	dg: [String],
	th: [String],
	visits: [ATDVisitSchema]
});

module.exports = mongoose.module('atdchart', ATDChartSchema);