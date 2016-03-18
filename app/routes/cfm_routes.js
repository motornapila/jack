var mongoose = require('mongoose');
var Patient  = require('../models/Patient.js');
var CFMChart = require('../models/CFMChart.js');

module.exports = function(app){

	//GET patients cfm chart data from db and returns json
	app.get('/patients/:jmbg/charts/cfm', function(req, res, next){
		var query = Patient.findOne({jmbg: req.params.jmbg});

		query.exec(function(err, patient){
			if(err){return next(err);}

			res.json(patient.cfm_chart);
		});
	});

	//POST chart data and update cfm_chart subdocument
	app.post('/patients/:jmbg/charts/cfm', function(req, res, next){
		var chart_data = new CFMChart.CFMChart(req.body);

		var updates = {$set : {cfm_chart: chart_data}};
		Patient.findOneAndUpdate({jmbg: req.params.jmbg}, updates, {new: true}, function(err, patient){
			if(err) {return next(err);}

			res.json(patient);
		});

	}); //end post cfm chart


	//POST visit data and pushes it to the visits array in db
	app.post('/patients/:jmbg/charts/cfm/visits', function(req, res, next){
		var visit = new CFMChart.CFMVisit(req.body);

		var updates = {$push: {'cfm_chart.visits': visit}};

		Patient.findOneAndUpdate(
			{jmbg: req.params.jmbg}, 
			updates, 
			{new: true, upsert: true, runValidators: true}, 
			function(err, data){
				if(err){return next(err);}

				res.json(data);
		}); 
	});//end post cfm visit

}; //end module exports