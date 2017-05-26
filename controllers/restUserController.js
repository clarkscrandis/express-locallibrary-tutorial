var PythonShell = require('python-shell')


// Display list of all Users
exports.user_list = function(req, res) {
	res.send('NOT IMPLEMENTED: User list');
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
// Need to replace this code and pull json data out of the body.
/*
    req.checkBody('first_name', 'First name must be specified.').notEmpty(); //We won't force Alphanumeric, because people might have spaces.
    req.checkBody('family_name', 'Family name must be specified.').notEmpty();
    req.checkBody('family_name', 'Family name must be alphanumeric text.').isAlpha();
    
    req.sanitize('first_name').escape();
    req.sanitize('family_name').escape();
    req.sanitize('first_name').trim();     
    req.sanitize('family_name').trim();

    var errors = req.validationErrors();
*/
	var errors = 0
	    
    if (errors) {
        res.render('user_form', { title: 'Create User', user: user, errors: errors});
    return;
    } 
    else {
    // Data from form is valid

/*    
        var user = { first_name: req.body.first_name, 
        	         family_name: req.body.family_name
        	       };
        
        var pyOptions = {
                scriptPath : '../pythonExperiment',
                pythonOptions: '-u',
                args: ['add', JSON.stringify(user)]
            };
*/
		var dataToSend = req.body;
		var txtToSend = JSON.stringify(dataToSend)
		
        var pyOptions = {
                scriptPath : '../pythonExperiment',
                pythonOptions: '-u',
                args: ['add', txtToSend]
            };
        var shell = new PythonShell('users.py', pyOptions);
        var output = '';
        shell.on('message', function(message) {
            console.log('FROM PYTHON: ' + message);
            output += ''+message;
            //one message for each print
//            res.send(message);
        });
        shell.on('error', function(message) {
        	console.log('ERROR FROM PYTHON: ' + message);
        	//one message for each stderr.write
        	//Need to display the error message in a pop-up
        });
        shell.end(function(err) {
            if (err) {
                console.log(err);
            } else {
            	console.log('Total output:' + output)
            	res.send(output);
            }
        }); 
//        res.send(message);
//        res.send('Wish I knew the proper way to implement a model for saving data!');
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