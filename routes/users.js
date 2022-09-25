const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

router.get('/create', usersController.create_user);

module.exports = router;