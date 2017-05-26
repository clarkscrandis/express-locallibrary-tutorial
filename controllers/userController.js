//var User = require('../models/user');
var User = require('../models/user');
var PythonShell = require('python-shell');
var request = require("request");
var async = require('async');

// Display list of all Users
exports.user_list = function(req, res) {
	User.getSuggestions(req.params.userName).then(function (result) {
		res.json(result)
	});
//	res.send('NOT IMPLEMENTED: User list');
};

// Display detail page for a specific User
exports.user_detail = function(req, res) {
	res.send('NOT IMPLEMENTED: User detail' + req.params.id);
};

//Display User create form on GET
exports.user_create_get = function(req, res) {
    res.render('user_form', { title: 'Create User'});
};

// Handle User create on POST
exports.user_create_post = function(req, res) {
    req.checkBody('first_name', 'First name must be specified.').notEmpty(); //We won't force Alphanumeric, because people might have spaces.
    req.checkBody('family_name', 'Family name must be specified.').notEmpty();
    req.checkBody('family_name', 'Family name must be alphanumeric text.').isAlpha();
    
    req.sanitize('first_name').escape();
    req.sanitize('family_name').escape();
    req.sanitize('first_name').trim();     
    req.sanitize('family_name').trim();

    var errors = req.validationErrors();
    
    if (errors) {
        res.render('user_form', { title: 'Create User', user: user, errors: errors});
    return;
    } 
    else {
    // Data from form is valid call the restful endpoint
     	callRestUserEndpoint(req, function(err, result){
    		if (err){
    			res.send(500, {error: 'something blew up when calling: http://localhost:3000/REST/user/create', response: result});
    		} else {
    			res.send(result);
    		}
    	});

    }
};

var callRestUserEndpoint = function (req, callback){
	var createUserData = { first_name: req.body.first_name, 
		        		   family_name: req.body.family_name
		       			 };
	//var jsonContent = JSON.stringify(createUserData);
	
	var url = 'http://localhost:3000/REST/user/create';
		
	//fire request
	request({
	        url: url,
	        method: "POST",
	        json: createUserData
	}, function (error, response, body) {
	    if (!error && response.statusCode === 200) {
	        callback(null, body);
	    }
	    else {
	    	console.log(body);
	    	callback(error, body);
	    }
	})
}

// Display User delete form on GET
exports.user_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: User delete GET');
};

// Handle User delete on POST
exports.user_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: User delete POST');
};

// Display User update form on GET
exports.user_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: User update GET');
};

// Handle User update on POST
exports.user_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: User update POST');
};