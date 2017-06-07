var express = require('express');
var router = express.Router();

// Require controller modules
var restUserController = require('../controllers/restUserController'); 
var restCountController = require('../controllers/restCountController'); 

/// RESTful User Routes ///

/* GET list of all Users. */
router.get('/users', restUserController.users_list);

/* Create User with a POST or PUT. */
router.post('/users', restUserController.user_create);
router.put('/users', restUserController.user_create);

/* Delete User. */
router.delete('/users/:userId', restUserController.user_delete);

/* Update User with POST or PUT. */
router.put('/users/:userId', restUserController.user_update);
router.post('/users/:userId', restUserController.user_update);

/* GET one User. */
router.get('/users/:userId', restUserController.user_detail);

/// RESTful Count Routes ///

/* GET Counts of all resources. */
router.get('/counts', restCountController.counts_list);

/* GET count of the Users in the system */
router.get('/counts/users', restCountController.count_of_users);


module.exports = router;
