var PythonShell = require('python-shell')
var validate = require('jsonschema').validate;

// Display list of all Users
//GET: http://localhost:3000/REST/users
//body: N/A
exports.user_list = function(req, res) {
	// Data from request is valid
	var txtToSend = '{}'
	console.log(txtToSend);
	
    var pyOptions = {
            scriptPath : '../pythonExperiment',
            pythonOptions: '-u',
            args: ['getAll', txtToSend]
        };
    PythonShell.run('users.py', pyOptions, function(err, results){
        if (err) {
            res.status(500).send({error: 'Python error: ' + err, debug: err});
        } else {
        	//results are an array of messages sent to stdout. When working properly, we should only have one.
        	if (results.length == 1) {
        		if (results[0].length == 0){
        			// If nothing is returned, send a 204 indicating No Content...because this not OK
        			res.status(204).send(results[0]);
        		} else {
        			returnValue = JSON.parse(results[0]);
        			if (returnValue.foundUserList.length == 0) {
        				res.status(204).send(JSON.stringify(returnValue.missingUserIdList))
        			} else {
        				res.send(JSON.stringify(returnValue.foundUserList));
        			}
        		}
        	} else {
        		// Must have left some debugging prints in the Python code
        		res.status(500).send({error: 'Too much data returned. Probably left some python debugging in place: ' + results})
        	}
        }        	
    });
};

// Display detail for a specific User
//POST: http://localhost:3000/REST/user/get 
//body: [{"userId":"AVxlGsexxZVa2KAs0CWh"}]
exports.user_detail_post = function(req, res) {
	var getUserSchema = { 
			"type":"array",
			"items":{
				"type":"object",
				"additionalProperties": false,
				"properties": {
					"userId":{"allOf":[
						{"minLength":1},
						{"maxLength":100}]
					}
					
				},
				"required":["userId"]
			}
		};

	var dataToSend = req.body;
	result = validate(dataToSend, getUserSchema);

	if (!result.valid) {
        res.status(400).send({error: 'Poorly formatted request: ', debug: result.errors});
    } 
    else {
    	// Data from request is valid
		var txtToSend = JSON.stringify(dataToSend)
		console.log(txtToSend);
		
        var pyOptions = {
                scriptPath : '../pythonExperiment',
                pythonOptions: '-u',
                args: ['get', txtToSend]
            };
        PythonShell.run('users.py', pyOptions, function(err, results){
            if (err) {
                res.status(500).send({error: 'Python error: ' + err, debug: err});
            } else {
            	//results are an array of messages sent to stdout. When working properly, we should only have one.
            	if (results.length == 1) {
            		if (results[0].length == 0){
            			// If nothing is returned, send a 204 indicating No Content...because this not OK
            			res.status(204).send(results[0]);
            		} else {
            			returnValue = JSON.parse(results[0]);
            			if (returnValue.foundUserList.length == 0) {
            				res.status(204).send(JSON.stringify(returnValue.missingUserIdList))
            			} else {
            				res.send(JSON.stringify(returnValue.foundUserList));
            			}
            		}
            	} else {
            		// Must have left some debugging prints in the Python code
            		res.status(500).send({error: 'Too much data returned. Probably left some python debugging in place: ' + results})
            	}
            }        	
        });
/*      
  		// Alternative technique for calling python and processing the result(s)
        var shell = new PythonShell('users.py', pyOptions);
        var output = '';
        var errOutput = '';
        shell.on('message', function(message) {
            console.log('FROM PYTHON: ' + message);
            output += ' '+message;
            //one message for each print
        });
        shell.on('error', function(message) {
        	console.log('ERROR FROM PYTHON: ' + message);
        	errOutput += ' '+message;
        	//one message for each stderr.write (sometimes)
        });
        shell.end(function(err) {
            if (err) {
                res.status(500).send({error: 'Error message: ' + err, debug: err});
            } else {
            	console.log('Total output:' + output)
            	res.send(output);
            }
        }); 
*/
    }
};

//Display User create form on GET
exports.user_create_get = function(req, res) {
	res.send('NOT IMPLEMENTED: User create GET');
};

// Handle User create on POST
//POST: http://localhost:3000/REST/user/create 
//body: [{"firstName":"bogusFirstName","lastName":"bogusLastName","email":"name@company.com"}]
exports.user_create_post = function(req, res) {
	var getUserSchema = { 
			"type":"array",
			"items":{
				"type":"object",
				"additionalProperties": false,
				"properties": {
					"firstName":{"allOf":[
						{"type":"string"},
						{"maxLength":100}]
					},
					"lastName":{"allOf":[
						{"type":"string"},
						{"maxLength":100}]
					},
					"email":{"allOf":[
						{"type":"string"},
						{"format":"email"},
						{"minLength":1},
						{"maxLength":100}]
					},
					
				},
				"required":["email"]
			}
		};

	var dataToSend = req.body;
	
	result = validate(dataToSend, getUserSchema);

	if (!result.valid) {
        res.status(400).send({error: 'Poorly formatted request: ', debug: result.errors});
    } 
    else {
    	// Data from request is valid
		var txtToSend = JSON.stringify(dataToSend)
		
        var pyOptions = {
                scriptPath : '../pythonExperiment',
                pythonOptions: '-u',
                args: ['add', txtToSend]
            };
        PythonShell.run('users.py', pyOptions, function(err, results){
            if (err) {
                res.status(500).send({error: 'Python error: ' + err, debug: err});
            } else {
            	//results are an array of messages sent to stdout. When working properly, we should only have one.
            	if (results.length == 1) {
            		if (results[0].length == 0){
            			// If nothing is returned, send a 204 indicating No Content...because this not OK
            			res.status(204).send(results[0]);
            		} else {
            			returnValue = JSON.parse(results[0]);
            			if (returnValue.existingUserList.length > 0){
            				res.status(409).send(JSON.stringify(returnValue));
            			} else {
            				res.send(JSON.stringify(returnValue.addedUserList));
            			}
            		}
            	} else {
            		// Must have left some debugging prints in the Python code
            		res.status(500).send({error: 'Too much data returned. Probably left some python debugging in place: ' + results})
            	}
            }        	
        });
    }
};

// Handle User delete on GET
//GET: http://localhost:3000/REST/user/<userId>/delete 
//body: N/A
exports.user_delete_get = function(req, res) {
	var userId = req.params.id;
    
	userId = userId.replace(/\s/g,''); //Remove white spaces.
	
    if (!userId.length) {
        res.status(400).send({error: 'You need to specify a userId to delete: ', debug: 'REST/user/<userId>/delete'});
    } 
    else {
    	// Data from request is valid
		var dataToSend = [{userId : req.params.id}];
		var txtToSend = JSON.stringify(dataToSend);
		
        var pyOptions = {
                scriptPath : '../pythonExperiment',
                pythonOptions: '-u',
                args: ['delete', txtToSend]
            };
        PythonShell.run('users.py', pyOptions, function(err, results){
            if (err) {
                res.status(500).send({error: 'Python error: ' + err, debug: err});
            } else {
            	//results are an array of messages sent to stdout. When working properly, we should only have one.
            	if (results.length == 1) {
            		if (results[0].length == 0){
            			// If nothing is returned, send a 204 indicating No Content...because this not OK
            			res.status(204).send(results[0]);
            		} else {
            			returnValue = JSON.parse(results[0]);
            			if (returnValue.missingUserIdList.length > 0){
            				res.status(409).send(JSON.stringify(returnValue));
            			} else {
            				res.send(JSON.stringify(returnValue.deletedUserIdList));
            			}
            		}
            	} else {
            		// Must have left some debugging prints in the Python code
            		res.status(500).send({error: 'Too much data returned. Probably left some python debugging in place: ' + results})
            	}
            }        	
        });
    }
};

// Handle User delete on POST
//POST: http://localhost:3000/REST/user/<userId>/delete 
//body: N/A
exports.user_delete_post = function(req, res) {
	var userId = req.params.id;
    
	userId = userId.replace(/\s/g,''); //Remove white spaces.
	
    if (!userId.length) {
        res.status(400).send({error: 'You need to specify a userId to delete: ', debug: 'REST/user/<userId>/delete'});
    } 
    else {
    	// Data from request is valid
		var dataToSend = [{userId : req.params.id}];
		var txtToSend = JSON.stringify(dataToSend);
		
        var pyOptions = {
                scriptPath : '../pythonExperiment',
                pythonOptions: '-u',
                args: ['delete', txtToSend]
            };
        PythonShell.run('users.py', pyOptions, function(err, results){
            if (err) {
                res.status(500).send({error: 'Python error: ' + err, debug: err});
            } else {
            	//results are an array of messages sent to stdout. When working properly, we should only have one.
            	if (results.length == 1) {
            		if (results[0].length == 0){
            			// If nothing is returned, send a 204 indicating No Content...because this not OK
            			res.status(204).send(results[0]);
            		} else {
            			returnValue = JSON.parse(results[0]);
            			if (returnValue.missingUserIdList.length > 0){
            				res.status(409).send(JSON.stringify(returnValue));
            			} else {
            				res.send(JSON.stringify(returnValue.deletedUserIdList));
            			}
            		}
            	} else {
            		// Must have left some debugging prints in the Python code
            		res.status(500).send({error: 'Too much data returned. Probably left some python debugging in place: ' + results})
            	}
            }        	
        });
    }
};

// Handle User update on GET
//GET: http://localhost:3000/REST/user/<userId>/update?firstName=updatedName&contractIdSet=id1&contractIdSet=id2]
//body: N/A
exports.user_update_get = function(req, res) {
	//NOTE: Id parameters are alphanumeric strings...and could be all numbers, so we can't restrict the type to a string.
	var updateUserSchema = { 
			"type":"object",
			"additionalProperties": false,
			"properties": {
				"companyId":{"allOf":[
					{"type":"string"},
					{"minLength":1},
					{"maxLength":100}]
				},
				"contractIdSet":{
					"type":"array",
					"items":{
						"allOf":[
							{"minLength":1},
							{"maxLength":100}]
					}
				},
				"email":{
					"not": {}
				},
				"firstName":{"allOf":[
					{"type":"string"},
					{"maxLength":100}]
				},
				"lastName":{"allOf":[
					{"type":"string"},
					{"maxLength":100}]
				},
				"permissionSet":{
					"type":"array",
					"items":{
						"allOf":[
							{"type":"string"},
							{"minLength":1},
							{"maxLength":100}]
					}
				},
				"searchIdSet":{
					"type":"array",
					"items":{
						"allOf":[
							{"minLength":1},
							{"maxLength":100}]
					}
				},
				"resumeIdSet":{
					"type":"array",
					"items":{
						"allOf":[
							{"minLength":1},
							{"maxLength":100}]
					}
				},
				"roleSet":{
					"type":"array",
					"items":{
						"allOf":[
							{"type":"string"},
							{"minLength":1},
							{"maxLength":100}]
					}
				},
				"userId":{"allOf":[
					{"minLength":1},
					{"maxLength":100}]
				}
			},
			"required":["userId"]
		};

	//Pull parameters out of the URL and put into structure for validation and to pass to the python code 
	var dataToSend = {};
	commandlineParams = req.query;
	Object.keys(commandlineParams).forEach(key => {
		if (commandlineParams[key]) {
			dataToSend[key] = commandlineParams[key];
		}
	});
	dataToSend['userId'] = req.params.id;
	
	result = validate(dataToSend, updateUserSchema);

	if (!result.valid) {
        res.status(400).send({error: 'Poorly formatted request: ', debug: result.errors});
    } 
	else {
    	// Data from request is valid
    	txtToSend = JSON.stringify(dataToSend);
		
        var pyOptions = {
                scriptPath : '../pythonExperiment',
                pythonOptions: '-u',
                args: ['update', txtToSend]
            };
        PythonShell.run('users.py', pyOptions, function(err, results){
            if (err) {
                res.status(500).send({error: 'Python error: ' + err, debug: err});
            } else {
            	//results are an array of messages sent to stdout. When working properly, we should only have one.
            	if (results.length == 1) {
            		if (results[0].length == 0){
            			// If nothing is returned, send a 204 indicating No Content...because this not OK
            			res.status(204).send(results[0]);
            		} else {
            			res.send(results[0]);
            		}
            	} else {
            		// Must have left some debugging prints in the Python code
            		res.status(500).send({error: 'Too much data returned. Probably left some python debugging in place: ' + results})
            	}
            }        	
        });
    }
};

// Handle User update on POST
// Make sure the Schema matches what is defined in the user init python code PLUS includes userId
//POST: http://localhost:3000/REST/user/<userId>/update 
//body: {"firstName":"bogusFirstName","lastName":"bogusLastName","userId":"123","contractIdSet":["AEF123"]}
exports.user_update_post = function(req, res) {
	
	//NOTE: Id parameters are alphanumeric strings...and could be all numbers, so we can't restrict the type to a string.
	var updateUserSchema = { 
			"type":"object",
			"additionalProperties": false,
			"properties": {
				"companyId":{"allOf":[
					{"type":"string"},
					{"minLength":1},
					{"maxLength":100}]
				},
				"contractIdSet":{
					"type":"array",
					"items":{
						"allOf":[
							{"minLength":1},
							{"maxLength":100}]
					}
				},
				"email":{
					"not": {}
				},
				"firstName":{"allOf":[
					{"type":"string"},
					{"maxLength":100}]
				},
				"lastName":{"allOf":[
					{"type":"string"},
					{"maxLength":100}]
				},
				"permissionSet":{
					"type":"array",
					"items":{
						"allOf":[
							{"type":"string"},
							{"minLength":1},
							{"maxLength":100}]
					}
				},
				"searchIdSet":{
					"type":"array",
					"items":{
						"allOf":[
							{"minLength":1},
							{"maxLength":100}]
					}
				},
				"resumeIdSet":{
					"type":"array",
					"items":{
						"allOf":[
							{"minLength":1},
							{"maxLength":100}]
					}
				},
				"roleSet":{
					"type":"array",
					"items":{
						"allOf":[
							{"type":"string"},
							{"minLength":1},
							{"maxLength":100}]
					}
				},
				"userId":{"allOf":[
					{"minLength":1},
					{"maxLength":100}]
				}
			},
			"required":["userId"]
		};

	var dataToSend = req.body;
	
	result = validate(dataToSend, updateUserSchema);

	if (!result.valid) {
        res.status(400).send({error: 'Poorly formatted request: ', debug: result.errors});
    } 
    else {
    	// Data from request is valid
		var txtToSend = JSON.stringify(dataToSend)
		
        var pyOptions = {
                scriptPath : '../pythonExperiment',
                pythonOptions: '-u',
                args: ['update', txtToSend]
            };
		//console.log(txtToSend)
        PythonShell.run('users.py', pyOptions, function(err, results){
            if (err) {
                res.status(500).send({error: 'Python error: ' + err, debug: err});
            } else {
            	//results are an array of messages sent to stdout. When working properly, we should only have one.
            	if (results.length == 1) {
            		if (results[0].length == 0){
            			// If nothing is returned, send a 204 indicating No Content...because this not OK
            			res.status(204).send(results[0]);
            		} else {
            			res.send(results[0]);
            		}
            	} else {
            		// Must have left some debugging prints in the Python code
            		res.status(500).send({error: 'Too much data returned. Probably left some python debugging in place: ' + results})
            	}
            }        	
        });
    }
};