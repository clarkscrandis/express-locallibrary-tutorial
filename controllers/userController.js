//var User = require('../models/user');
var User = require('../models/user');
var PythonShell = require('python-shell');
var request = require("request");
var async = require('async');

var REST_ADDR = 'http://localhost:3000'

// Display list of all Users
exports.user_list = function(req, res) {
	User.getSuggestions(req.params.userName).then(function (result) {
		res.json(result)
	});
//	res.send('NOT IMPLEMENTED: User list');
};

// Display detail page for a specific User
exports.user_detail = function(req, res, next) {

	var getUserRequestData = [{userId: req.params.id}];
	
	var url = REST_ADDR + '/REST/user/get';
		
	//fire request
	request({
	        url: url,
	        method: "POST",
	        json: getUserRequestData
	}, function (err, response, body) {
	    if (!err && response.statusCode === 200) {
	    	if (!body){
				var error = new Error('No data returned from server while performing http://localhost:3000/REST/user/get');
				error.status = response.statusCode;
				next(error);
	    	} else {
				var userList = body;
			    res.render('user_detail', { title: 'User Detail', user: userList[0] } );
	    	}
	    } else if (!err && response.statusCode === 204) {
	        var user = { first_name: req.params.id + " Not Found",
	    	         	family_name: ''
	    	       		};
		    res.render('user_detail', { title: 'User Detail', user: user } );
	    } else {
			var error = new Error('Error occurred while performing http://localhost:3000/REST/user/get');
			error.status = response.statusCode;
			error.stack = JSON.stringify(body);
			next(error);
	    }
	})
};

//Display User create form on GET
exports.user_create_get = function(req, res) {
    res.render('user_form', { title: 'Create User'});
};

// Handle User create on POST
exports.user_create_post = function(req, res, next) {
	//Validate form data
    req.checkBody('first_name', 'First name must be specified.').notEmpty(); //We won't force Alphanumeric, because people might have spaces.
    req.checkBody('family_name', 'Family name must be specified.').notEmpty();
    req.checkBody('family_name', 'Family name must be alphanumeric text.').isAlpha();
    
    req.sanitize('first_name').escape();
    req.sanitize('family_name').escape();
    req.sanitize('first_name').trim();     
    req.sanitize('family_name').trim();

    var errors = req.validationErrors();

    var user = { first_name: req.body.first_name,
    	         family_name: req.body.family_name
    	       };

    if (errors) {
    	// Data from form is NOT valid. Reload the form and display the errors.
        res.render('user_form', { title: 'Create User', user: user, errors: errors});
        return;
    } else {
    	// Data from form is valid. Call the restful end point.
    	var createUserData = [user];
    	var url = REST_ADDR + '/REST/user/create';

		//fire REST request
		request({
					url: url,
					method: "POST",
					json: createUserData
				}, function (err, response, body) {
					if (!err && response.statusCode === 200) {
				    	if (!body){
							var error = new Error('No data returned from server while performing http://localhost:3000/REST/user/create');
							error.status = response.statusCode;
							next(error);
				    	} else {
							var userList = body;
							res.redirect('/catalog/user/'+userList[0].userId);
				    	}
					} else {
		    			var error = new Error('Error occurred while performing http://localhost:3000/REST/user/create');
		    			error.status = response.statusCode;
		    			error.stack = JSON.stringify(body);
		    			next(error);
					}
				})
    }
};

/*
exports.user_create_post = function(req, res, next) {
	//Validate form data
    req.checkBody('first_name', 'First name must be specified.').notEmpty(); //We won't force Alphanumeric, because people might have spaces.
    req.checkBody('family_name', 'Family name must be specified.').notEmpty();
    req.checkBody('family_name', 'Family name must be alphanumeric text.').isAlpha();
    
    req.sanitize('first_name').escape();
    req.sanitize('family_name').escape();
    req.sanitize('first_name').trim();     
    req.sanitize('family_name').trim();

    var errors = req.validationErrors();

    var user = { first_name: req.body.first_name,
    	         family_name: req.body.family_name
    	       };

    if (errors) {
        res.render('user_form', { title: 'Create User', user: user, errors: errors});
        return;
    } else {
    // Data from form is valid call the restful endpoint
     	callRestUserEndpoint(req, function(err, result){
    		if (err){
    			//res.status(err).send({error: 'Error occurred while performing: http://localhost:3000/REST/user/create', response: result});
    			//res.status(err).render('error')
    			var error = new Error('Error occurred while performing: http://localhost:3000/REST/user/create');
    			error.status = err;
    			error.stack = JSON.stringify(result);
    			next(error);

    		} else {
                res.redirect('/catalog/user/'+result[0].userId);
    		}
    	});

    }
};

var callRestUserEndpoint = function (req, callback){
	var createUserData = [{ first_name: req.body.first_name, 
		        		   family_name: req.body.family_name
		       			 }];
	//var jsonContent = JSON.stringify(createUserData);
	
	var url = REST_ADDR + '/REST/user/create';
		
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
	    	callback(response.statusCode, body);
	    }
	})
}
*/

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