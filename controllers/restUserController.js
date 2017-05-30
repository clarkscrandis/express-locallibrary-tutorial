var PythonShell = require('python-shell')


// Display list of all Users
exports.user_list = function(req, res) {
	res.send('NOT IMPLEMENTED: User list');
};

// Display detail for a specific User
exports.user_detail_post = function(req, res) {
	// TODO: Need to validate json data in the body.
	var errors = 0
    
    if (errors) {
        res.status(400).send({error: 'Poorly formatted request: ', debug: errors});
    } 
    else {
    	// Data from request is valid
		var dataToSend = req.body;
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
            			res.send(results[0]);
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
exports.user_create_post = function(req, res) {
// TODO: Need to validate json data in the body.
	var errors = 0
	    
    if (errors) {
        res.status(400).send({error: 'Poorly formatted request: ', debug: errors});
    } 
    else {
    	// Data from request is valid
		var dataToSend = req.body;
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