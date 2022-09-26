const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

router.get('/', usersController.get_all_users);

router.post('/sign-up', usersController.sign_up);

router.get('/:id', usersController.get_user);

module.exports = router;