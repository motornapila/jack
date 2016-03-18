var mongoose = require('mongoose');
var Patient  = require('./models/Patient.js');
var ATDChart = require('./models/ATDChart.js');
var CFMChart = require('./models/CFMChart.js');


//Opens App routes
module.exports = function(app){
	//GET routes

	//Retreive records of all patients - REMOVE LATER
	app.get('/patients', function(req, res, next){
		var query = Patient.find({});
		query.exec(function(err, patients){
			if(err) {
				return next(err);
			}

			res.json(patients);
		});
	});	//end get /patients

	//POST routes

	//Save new patient to DB
	app.post('/patients', function(req, res, next){
		var new_patient = new Patient(req.body);

		new_patient.save(function(err){
			if(err){
				return next(err);
			}

			res.json(req.body);
		});
	});

	app.get('/patients/:jmbg', function(req, res, next){
		var query = Patient.findOne({'jmbg' : req.params.jmbg});

		query.exec(function(err, patient){
			if(err){ return next(err); }

			if (!patient || patient === null) { 
				return next(new Error("Greška! Nema traženog pacijenta!"));
			}
			res.json(patient);
		});
	}); //end app get patient/jmbg

	app.delete('/patients/:patient_id', function(req, res, next){
		//Funkcija za brisanje pacijenata
		//Samo za admin korisnika
		Patient.remove({_id: req.params.patient_id}, function(err, patients){
			if(err){ return next(err); }

			Patient.find(function(err, patients){
				if(err){return next(err);}

				res.json(patients);
			});
		});
	}); //end app.delete

	app.post('/patients/:jmbg', function(req, res, next){
		
		var updates = {$set : req.body};
		Patient.findOneAndUpdate({jmbg: req.params.jmbg}, updates, {new: true, runValidators: true}, function(err, patient){
			if(err) { return next(err); }

			res.json(patient);
		});
	}); //end app.update /patient/jmbg

	app.get('/patients/:jmbg/charts/atd', function(req, res, next){
		
		var query = Patient.findOne({jmbg: req.params.jmbg});

		query.exec(function(err, patient){
			if(err) {return next(err);}

			res.json(patient.atd_chart); //MAYBE
		});

	});


	app.get('/patients/:jmbg/charts/cfm', function(req, res, next){
		var query = Patient.findOne({jmbg: req.params.jmbg});

		query.exec(function(err, patient){
			if(err){return next(err);}

			res.json(patient.cfm_chart);
		});
	});

	app.post('/patients/:jmbg/charts/atd', function(req, res, next){
		var chart_data = new ATDChart(req.body);

		var updates = {$set : {atd_chart: chart_data}};
		Patient.findOneAndUpdate({jmbg: req.params.jmbg}, updates, {new: true}, function(err, patient){
			if(err) {return next(err);}

			res.json(patient);
		});
	}); //end post atd chart

	app.post('/patients/:jmbg/charts/cfm', function(req, res, next){
		var chart_data = new CFMChart.CFMChart(req.body);

		var updates = {$set : {cfm_chart: chart_data}};
		Patient.findOneAndUpdate({jmbg: req.params.jmbg}, updates, {new: true}, function(err, patient){
			if(err) {return next(err);}

			res.json(patient);
		});

	}); //end post cfm chart

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

};