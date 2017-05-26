var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* GET users listing. */
router.get('/cool/', function(req, res, next) {
  res.send('You\'re so cool');
});

/* Example of using route parameters to capture values specified at their position in the URL */
router.get('/:userId/groups/:groupId', function(req, res) {
	// Access userId via req.params.userId
	// Access groupId via req.params.userId
  res.send(req.params);
});

module.exports = router;
