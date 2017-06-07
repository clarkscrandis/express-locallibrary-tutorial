var PythonShell = require('python-shell')
var validate = require('jsonschema').validate;

// Display list of all Counts
//GET: http://localhost:3000/REST/counts
//body: N/A
//Send the following structure to python
//python counts.py getAll {} 
exports.counts_list = function(req, res) {
	var txtToSend = '{}';
	
	//console.log(txtToSend);
	
    var pyOptions = {
            scriptPath : '../pythonExperiment',
            pythonOptions: '-u',
            args: ['getAll', txtToSend]
        };
    PythonShell.run('counts.py', pyOptions, function(err, results){
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
};

exports.count_of_users = function(req, res) {
	var txtToSend = '["users"]';
	
	//console.log(txtToSend);
	
    var pyOptions = {
            scriptPath : '../pythonExperiment',
            pythonOptions: '-u',
            args: ['get', txtToSend]
        };
    PythonShell.run('counts.py', pyOptions, function(err, results){
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
};