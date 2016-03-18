var mongoose = require('mongoose');

var CFMVisitSchema = new mongoose.Schema({
	visit_date: { type: Date, required: true, default: Date.now },
	visit_type: { type: String, required: true },
	tests: String,
	dg: String,
	th: {
		electro: String,
		thermo: String,
		active_kinez: String,
		pasive_kinez: String,
		ultrasound: String,
		medicament: String
	},
	refferal: String,
	napomena: String,
	created_at: {type: Date, default: Date.now},
	updated_at: {type: Date, default: Date.now},
	updated_by: {type: String, default: 'test'}
});

CFMVisitSchema.pre('findOneAndUpdate', function(next){
	now = new Date();
	this.updated_at = now;
	if(!this.created_at){
		this.created_at = now;
	}
	next();
});

var CFMChartSchema = new mongoose.Schema({
	chart_number: { type: Number, required: true },
	//patient: {type: mongoose.Schema.Types.ObjectId, ref: 'Patient'},
	visits: [CFMVisitSchema]
});

var CFMChart = mongoose.model('CFMChart', CFMChartSchema);
var CFMVisit = mongoose.model('CFMVisit', CFMVisitSchema);
//module.exports = mongoose.model('CFMChart', CFMChartSchema);
module.exports = {
	CFMChart: CFMChart,
	CFMVisit: CFMVisit
};