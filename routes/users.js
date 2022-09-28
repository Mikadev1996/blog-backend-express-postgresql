const express = require('express');
const usersController = require('../controllers/usersController');
const authenticationToken = require('../authenticateToken');
const router = express.Router();

// User Auth
router.post('/log-in', usersController.log_in);
router.post('/sign-up', usersController.sign_up);
router.post('/log-out', usersController.log_out);

// User details
router.get('/', authenticationToken, usersController.get_all_users);
router.get('/:id', authenticationToken, usersController.get_user);

module.exports = router;