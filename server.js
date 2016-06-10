var dotenv			= require('dotenv');
dotenv.load();

var express 		= require('express');
var mongoose 		= require('mongoose');
var port 			= process.env.PORT || 3000;
var morgan 			= require('morgan');
var bodyParser 		= require('body-parser');
var methodOverride 	= require('method-override');
var passport		= require('passport');
var Strategy		= require('passport-local').Strategy;
var expressSession	= require('express-session');
var User            = require('./app/models/User.js');
var app 			= express();
var mongoUri		= process.env.MONGO_URI;

//connection to mongoDB
//mongoose.connect('mongodb://motornapila:mpila225@ds011459.mlab.com:11459/dzek');
mongoose.connect(mongoUri);

//Logging and parsing
app.use(express.static(__dirname + '/public'));
app.use('/bower_components', express.static(__dirname + '/bower_components')); //use bower components
app.use(morgan('dev'));
app.use(bodyParser.json());							//parse application/json
app.use(bodyParser.urlencoded({extended: true})); 	// parse application/x-www-form-urlencoded
app.use(bodyParser.text());							// allows bodyParser to look at raw text
app.use(bodyParser.json({type: 'application/vnd.api+json'})); //parse application/vnd.api+json as json
app.use(methodOverride());

app.use(expressSession({
	secret: 'scatman',
	resave: false,
	saveUninitialized: false
}));

// Passport config:
app.use(new Strategy(function(username, password, cb){
	User.findByUsername(username, function(err, user){
		if(err) {return cb(err);}
		if(!user) {return cb(null, false);}
		if(user.password != password) { return cb(null, false);}
		return cb(null, user);
	});
}));

passport.serializeUser(function(user, cb) {
	cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
	User.findById(id, function(err, user) {
		if(err) {return cb(err);}
		cb(null, user);
	});
});

app.use(passport.initialize());
app.use(passport.session());

//Routes
require('./app/routes/routes.js')(app);
require('./app/routes/cfm_routes.js')(app);
require('./app/routes/atd_routes.js')(app);

//Listener
app.listen(port);
console.log('Jack is listening on port ' + port);