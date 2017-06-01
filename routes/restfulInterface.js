var express = require('express');
var router = express.Router();

// Require controller modules
var restUserController = require('../controllers/restUserController'); 

/// User Routes ///

/* GET request for creating User. NOTE This must come before route for id (i.e. display user) */
router.get('/user/create', restUserController.user_create_get);

/* POST request for creating User. */
router.post('/user/create', restUserController.user_create_post);

/* GET request to delete User. */
router.get('/user/:id/delete', restUserController.user_delete_get);

// POST request to delete User
router.post('/user/:id/delete', restUserController.user_delete_post);

/* GET request to update User. */
router.get('/user/:id/update', restUserController.user_update_get);

// POST request to update User
router.post('/user/:id/update', restUserController.user_update_post);

/* GET request for one User. */
router.post('/user/get', restUserController.user_detail_post);

/* GET request for list of all Users. */
router.get('/users', restUserController.user_list);

module.exports = router;
