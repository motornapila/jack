var mongoose = require('mongoose');
var cfm = require('./CFMChart.js');

var PatientSchema = new mongoose.Schema({
	jmbg: {
		type: String, 
		required: true,
		trim: true,
		unique: true,
		minlength: 13,
		maxlength: 13
	},
	name: {type: String, required: true},
	surname: {type: String, required: true},
	father: String,
	date_of_birth: {type: Date, required: true},
	residence: String,
	address: String,
	phone: String,
	sex: {type: String, required: true},
	blood_type: String,
	marital_status: String,
	insurance: {type: String, required: true},
	smoker: Boolean,
	created_at: {type: Date, default: Date.now},
	updated_at: {type: Date, default: Date.now},
	last_updater: {type: String, default: 'test'},
	//atd_chart: {type: mongoose.Schema.Types.ObjectId, ref: 'ATDChart'},
	//cfm_chart: {type: mongoose.Schema.Types.ObjectId, ref: 'CFMChart'}
	cfm_chart: cfm.CFMChart.schema
	//charts: [mongoose.Schema.Types.ObjectId]
});

PatientSchema.pre('save', function(next){
	now = new Date();
	this.updated_at = now;
	if(!this.created_at){
		this.created_at = now;
	}
	next();
});

PatientSchema.pre('findOneAndUpdate', function(next){
	now = new Date();
	this.updated_at = now;
	if(!this.created_at){
		this.created_at = now;
	}
	next();
});

module.exports = mongoose.model('Patient', PatientSchema);