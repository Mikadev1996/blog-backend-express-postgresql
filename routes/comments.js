const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

router.get('/:id', commentController.get_comments);
router.post('/:id', commentController.post_comment);

module.exports = router;