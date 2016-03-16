var mongoose = require('mongoose');
var Patient  = require('./models/Patient.js');
var ATDChart = require('./models/ATDChart.js');
//var ATDVisit = require('./models/ATDVisit.js');

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
		Patient.findOneAndUpdate({jmbg: req.params.jmbg}, updates, {new: true}, function(err, patient){
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

	app.post('/patients/:jmbg/charts/atd', function(req, res, next){
		var chart_data = new ATDChart(req.body);

		chart_data.save(function(err){
			if(err) {return next(err);}

			res.json(req.body);
		});
	}); //end post atd chart

	//NEVALJA SMISLI NEŠTO DRUGO
	app.post('/patients/:jmbg/charts/atd/visits', function(req, res, next){
		var visit_data = new ATDVisit(req.body);

		visit_data.save(function(err){
			if(err) {return next(err);}

			res.json(req.body);
		});
	}); //end post atd chart

};