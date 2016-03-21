var mongoose = require('mongoose');
var Patient  = require('../models/Patient.js');
var CFMChart = require('../models/ATDChart.js');

module.exports = function(app){

	//GET patients atd_chart data
	app.get('/patients/:jmbg/charts/atd', function(req, res, next){
		var query = Patient.findOne({jmbg: req.params.jmbg});

		query.exec(function(err, patient){
			if(err) {return next(err);}

			res.json(patient.atd_chart); //MAYBE
		});
	});

	

};