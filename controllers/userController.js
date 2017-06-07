//var User = require('../models/user');
var PythonShell = require('python-shell');
var request = require("request");
var async = require('async');

var REST_ADDR = 'http://localhost:3000'

// Display list of all Users
exports.user_list = function(req, res) {

	var url = REST_ADDR + '/REST/users';
		
	//fire request
	request({
	        url: url,
	        method: "GET"
	}, function (err, response, body) {
	    if (!err && response.statusCode === 200) {
	    	if (!body){
				var error = new Error('No data returned from server while performing http://localhost:3000/REST/users');
				error.status = response.statusCode;
				next(error);
	    	} else {
				userList = JSON.parse(body);
			    res.render('user_list', { title: 'User List', userList: userList } );
	    	}
	    } else if (!err && response.statusCode === 204) {
//	        var user = { email: req.params.id + " Not Found",
//	    	         	lastName: '',
//	    	         	firstName: ''
//	    	       		};
		    res.render('user_notFound', { title: 'No Users Not Found' } );
	    } else {
			var error = new Error('Error occurred while performing http://localhost:3000/REST/users');
			error.status = response.statusCode;
			error.stack = JSON.stringify(body);
			next(error);
	    }
	})
};

// Display detail page for a specific User
exports.user_detail = function(req, res, next) {

	var url = REST_ADDR + '/REST/users/' + req.params.id;
	
	//fire request
	request({
	        url: url,
	        method: "GET",
	}, function (err, response, body) {
	    if (!err && response.statusCode === 200) {
	    	if (!body){
				var error = new Error('No data returned from server while performing: ' + url);
				error.status = response.statusCode;
				next(error);
	    	} else {
				var userList = JSON.parse(body);
				//console.log(userList[0])
			    res.render('user_detail', { title: 'User Detail', user: userList[0] } );
	    	}
	    } else if (!err && response.statusCode === 204) {
//	        var user = { email: req.params.id + " Not Found",
//	    	         	lastName: '',
//	    	         	firstName: ''
//	    	       		};
		    res.render('user_notFound', { title: 'User Not Found', userId: req.params.id } );
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
    req.checkBody('firstName', 'First name must be specified.').notEmpty(); //We won't force Alphanumeric, because people might have spaces.
    req.checkBody('lastName', 'Family name must be specified.').notEmpty();
    req.checkBody('email', 'Email address must be specified.').notEmpty();
    req.checkBody('lastName', 'Family name must be alphanumeric text.').isAlpha();
    req.checkBody('email', 'Need a valid email address.').isEmail();
    
    req.sanitize('firstName').escape();
    req.sanitize('lastName').escape();
    req.sanitize('email').escape();
    req.sanitize('firstName').trim();     
    req.sanitize('lastName').trim();
    req.sanitize('email').trim();

    var errors = req.validationErrors();

    var user = { firstName: req.body.firstName,
    	         lastName: req.body.lastName,
    	         email: req.body.email
    	       };

    if (errors) {
    	// Data from form is NOT valid. Reload the form and display the errors.
        res.render('user_form', { title: 'Create User', user: user, errors: errors});
        return;
    } else {
    	// Data from form is valid. Call the restful end point.
    	var createUserData = [user];
    	var url = REST_ADDR + '/REST/users';

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
							res.redirect('/UI/user/'+userList[0].userId);
				    	}
					} else {
						//TODO: In the case of a 409 status code, we tried to create a user with an email address that is already in the system. We should update the UI to handle this.
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
    req.checkBody('firstName', 'First name must be specified.').notEmpty(); //We won't force Alphanumeric, because people might have spaces.
    req.checkBody('lastName', 'Family name must be specified.').notEmpty();
    req.checkBody('lastName', 'Family name must be alphanumeric text.').isAlpha();
    
    req.sanitize('firstName').escape();
    req.sanitize('lastName').escape();
    req.sanitize('firstName').trim();     
    req.sanitize('lastName').trim();

    var errors = req.validationErrors();

    var user = { firstName: req.body.firstName,
    	         lastName: req.body.lastName
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
                res.redirect('/UI/user/'+result[0].userId);
    		}
    	});

    }
};

var callRestUserEndpoint = function (req, callback){
	var createUserData = [{ firstName: req.body.firstName, 
		        		   lastName: req.body.lastName
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
	var getUserRequestData = [{userId: req.params.id}];
	
	var url = REST_ADDR + '/REST/users' + req.params.id;
		
	//fire request
	request({
	        url: url,
	        method: "DELETE"
	}, function (err, response, body) {
	    if (!err && response.statusCode === 200) {
	    	if (!body){
				var error = new Error('No data returned from server while performing http://localhost:3000/REST/user/get');
				error.status = response.statusCode;
				next(error);
	    	} else {
				var userList = body;
				//console.log(userList[0])
			    res.render('user_delete', { title: 'Delete User', user: userList[0] } );
	    	}
	    } else if (!err && response.statusCode === 204) {
		    res.render('user_notFound', { title: 'User Not Found', userId: req.params.id } );
	    } else {
			var error = new Error('Error occurred while performing http://localhost:3000/REST/user/get');
			error.status = response.statusCode;
			error.stack = JSON.stringify(body);
			next(error);
	    }
	})
};

// Handle User delete on POST
exports.user_delete_post = function(req, res, next) {
    req.checkBody('userId', 'User id must exist').notEmpty();
    var errors = req.validationErrors();

    var user = { userId : req.body.userId };

    if (errors) {
    	// Data from form is NOT valid. Reload the form and display the errors.
        res.render('user_delete', { title: 'User Not Found' } );// this isn't quite right
        return;
    } else {
    	// Data from form is valid. Call the restful end point.
    	var createUserData = [user];
    	var url = REST_ADDR + '/REST/users/' + req.body.userId;

		//fire REST request
		request({
					url: url,
					method: "DELETE"
				}, function (err, response, body) {
					if (!err && response.statusCode === 200) {
						res.redirect('/UI/user');
					} else {
		    			var error = new Error('Error occurred while deleting user: '+ req.params.id);
		    			error.status = response.statusCode;
		    			error.stack = JSON.stringify(body);
		    			next(error);
					}
				})
    }
};

// Display User update form on GET
exports.user_update_get = function(req, res) {
	var url = REST_ADDR + '/REST/users/' + req.params.id;
		
	//fire request
	request({
	        url: url,
	        method: "GET",
	}, function (err, response, body) {
	    if (!err && response.statusCode === 200) {
	    	if (!body){
				var error = new Error('No data returned from server while getting data associated with user: '+ req.params.id);
				error.status = response.statusCode;
				next(error);
	    	} else {
				var userList = JSON.parse(body);
				//console.log(userList[0])
			    res.render('user_update_form', { title: 'Update User', user: userList[0] } );
	    	}
	    } else if (!err && response.statusCode === 204) {
		    res.render('user_notFound', { title: 'User Not Found', userId: req.params.id } );
	    } else {
			var error = new Error('Error occurred while getting data associated with user: '+ req.params.id);
			error.status = response.statusCode;
			error.stack = JSON.stringify(body);
			next(error);
	    }
	})
};

// Handle User update on POST
exports.user_update_post = function(req, res, next) {
	//Validate form data
    req.checkBody('firstName', 'First name must be specified.').notEmpty(); //We won't force Alphanumeric, because people might have spaces.
    req.checkBody('lastName', 'Family name must be specified.').notEmpty();
    req.checkBody('lastName', 'Family name must be alphanumeric text.').isAlpha();
    
    req.sanitize('firstName').escape();
    req.sanitize('lastName').escape();
    req.sanitize('permissionSet').escape();
    req.sanitize('firstName').trim();     
    req.sanitize('lastName').trim();
    req.sanitize('permissionSet').trim();

    var errors = req.validationErrors();

    var user = { firstName: req.body.firstName,
    	         lastName: req.body.lastName,
    	         permissionSet: [req.body.permissionSet]
    	       };

    if (errors) {
    	// Data from form is NOT valid. Reload the form and display the errors.
        res.render('user_update_form', { title: 'Update User', user: user, errors: errors});
        return;
    } else {
    	// Data from form is valid. Call the restful end point.
    	var updateUserData = user;
    	var url = REST_ADDR + '/REST/users/' + req.params.id;

		//fire REST request
		request({
					url: url,
					method: "POST",
					json: updateUserData
				}, function (err, response, body) {
					if (!err && response.statusCode === 200) {
				    	if (!body){
							var error = new Error('No data returned from server while performing ' + url);
							error.status = response.statusCode;
							next(error);
				    	} else {
							var user = body;
							res.redirect('/UI/user/'+user.userId);
				    	}
					} else {
						//TODO: In the case of a 409 status code, we tried to create a user with an email address that is already in the system. We should update the UI to handle this.
		    			var error = new Error('Error occurred while performing ' + url);
		    			error.status = response.statusCode;
		    			error.stack = JSON.stringify(body);
		    			next(error);
					}
				})
    }
};

exports.index = function(req, res) {
	var url = REST_ADDR + '/REST/counts';
	
	//fire request
	request({
	        url: url,
	        method: "GET"
	}, function (err, response, body) {
	    if (!err && response.statusCode === 200) {
	    	if (!body){
				var error = new Error('No data returned from server while performing: ' + url);
				error.status = response.statusCode;
				next(error);
	    	} else {
				counts = JSON.parse(body);
				res.render('index', { title: 'My experimental system', error: err, data: counts });
	    	}
	    } else if (!err && response.statusCode === 204) {
	    	res.render('index', { title: 'System Home' });
	    } else {
			var error = new Error('Error occurred while performing: ' + url);
			error.status = response.statusCode;
			error.stack = JSON.stringify(body);
			next(error);
	    }
	})
};
