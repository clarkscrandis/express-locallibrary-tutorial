var PythonShell = require('python-shell')
var validate = require('jsonschema').validate;

// Display list of all Users
//GET: http://localhost:3000/REST/users
//body: N/A
//Send the following structure to python
//python users.py getAll {} 
exports.users_list = function(req, res) {
	var txtToSend = '{}';
	
	//console.log(txtToSend);
	
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

//Create User
//POST/PUT: http://localhost:3000/REST/users 
//body: [{"firstName":"bogusFirstName","lastName":"bogusLastName","email":"name@company.com"}]
//Send the following structure to python
//python users.py add [{"firstName":"bogusFirstName","lastName":"bogusLastName","email":"name@company.com"}]
exports.user_create = function(req, res) {
	var createUserSchema = { 
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
	
	result = validate(dataToSend, createUserSchema);

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
	//console.log(txtToSend);

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

//Delete User
//DELETE: http://localhost:3000/REST/users/<userId>
//body: N/A
//Send the following structure to python
//python users.py delete [{"userId":"AVxlGsexxZVa2KAs0CWh"}]
exports.user_delete = function(req, res) {
	var dataToSend = [{userId : req.params.userId}];
	var txtToSend = JSON.stringify(dataToSend);
	
	var pyOptions = {
		      scriptPath : '../pythonExperiment',
		      pythonOptions: '-u',
		      args: ['delete', txtToSend]
	      };
	
	//console.log(txtToSend);

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
};

//Update User
//Make sure the Schema matches what is defined in the user init python code
//POST/PUT: http://localhost:3000/REST/users/<userId>
//body: {"firstName":"bogusFirstName","lastName":"bogusLastName","contractIdSet":["AEF123"]}
//Send the following structure to python
//python users.py update {"firstName":"bogusFirstName","lastName":"bogusLastName","userId":"123","contractIdSet":["AEF123"]}
exports.user_update = function(req, res) {
	
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
				}
			}
		};

	var dataToSend = req.body;
	
	result = validate(dataToSend, updateUserSchema);

	if (!result.valid) {
     res.status(400).send({error: 'Poorly formatted request: ', debug: result.errors});
	} 
	else {
		// Data from request is valid insert the userId for the python code.
		dataToSend['userId'] = req.params.userId;
		
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


// Display detail for a specific User
//GET: http://localhost:3000/REST/users/<userId>
//body: N/A
//Send the following structure to python
//python users.py get [{"userId":"AVxlGsexxZVa2KAs0CWh"}]
exports.user_detail = function(req, res) {
	var dataToSend = [{userId : req.params.userId}];
	var txtToSend = JSON.stringify(dataToSend)
	
	//console.log(txtToSend);
	
    var pyOptions = {
            scriptPath : '../pythonExperiment',
            pythonOptions: '-u',
            args: ['get', txtToSend]
    };
	
	//console.log(txtToSend);
	
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

