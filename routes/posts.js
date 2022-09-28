const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authenticateToken = require('../authenticateToken');

router.get('/', postController.all_posts);
router.get('/:id', postController.post_by_user);

router.post('/create', authenticateToken, postController.create_post);
router.delete('/:id', authenticateToken, postController.delete_post);

router.put('/:id', authenticateToken, postController.update_post);
router.put('/:id/likes', authenticateToken, postController.like_post);

module.exports = router;