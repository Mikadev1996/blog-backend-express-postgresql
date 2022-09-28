const express = require('express');
const passport = require('passport');
const usersController = require('../controllers/usersController');
const router = express.Router();

router.get('/', usersController.get_all_users);

// User Auth
router.post('/log-in', usersController.log_in);
router.post('/sign-up', usersController.sign_up);
router.post('/log-out', usersController.log_out);

// User details
router.get('/:id', usersController.get_user);

module.exports = router;