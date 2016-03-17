var dotenv			= require('dotenv');
dotenv.load();

var express 		= require('express');
var mongoose 		= require('mongoose');
var port 			= process.env.PORT || 3000;
var morgan 			= require('morgan');
var bodyParser 		= require('body-parser');
var methodOverride 	= require('method-override');
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

//Routes
require('./app/routes.js')(app);

//Listener
app.listen(port);
console.log('Jack is listening on port ' + port);