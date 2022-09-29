const express = require('express');
const router = express.Router();
const authenticationToken = require('../authenticateToken');
const commentController = require('../controllers/commentsController');

router.get('/:id', commentController.get_comments);
router.post('/:id', authenticationToken, commentController.post_comment);

module.exports = router;