var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var PythonShell = require('python-shell')

var index = require('./routes/index');
var users = require('./routes/users');
var catalog = require('./routes/catalog');
var restfulInterface = require('./routes/restfulInterface')

// To debug, launch with: DEBUG=express-locallibrary-tutorial:* npm run devstart
// or: nodemon --debug ./bin/www
/*
var User = require('./models/user');

var user = new User();
	       
user.indexExists().then(function (exists) {
    if (exists) {
        return user.deleteIndex();
    }
}).then(function () {
    return user.initIndex().then(user.initMapping).then(function () {
        var promises = [
            'The Lord of the Rings',
            'The Hobbit',
            'The Little Prince',
            'Harry Potter and the Philosopher`s Stone',
            'And Then There Were None'
        ].map(function (userTitle) {
            return user.addUser({
                title: userTitle,
                content: userTitle + " content",
                metadata: {
                    titleLength: userTitle.length
                }
            });
        });
        return Promise.all(promises);
    });
});
*/

/* Make sure dependencies exist, otherwise, don't start the server
 * 
 */
var txtToSend = "{}"

var pyOptions = {
        scriptPath : '../pythonExperiment',
        pythonOptions: '-u',
        args: ['init', txtToSend]
    };
PythonShell.run('users.py', pyOptions, function(err, results){
    if (err) {
        console.log('Unable to initialize python backend: ../pythonExperiment/users.py');
		console.log(err)
        process.exit(1);
    } else {
    	//results are an array of messages sent to stdout. When working properly, we should only have one.
    	if (results.length == 1) {
    		if (results[0] != 'OK'){
    			console.log(results)
    	        process.exit(1);
    		}
    	} else {
    		// Must have left some debugging prints in the Python code
            console.log('WARNING: Some debugging prints were left in the python initialization code:');
    		console.log(results)
    	}
    }        	
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/catalog', catalog);
app.use('/REST', restfulInterface);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
