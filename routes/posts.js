const express = require('express');
const router = express.Router();
const postController = require('../controllers/postsController');
const authenticateToken = require('../auth/authenticateToken');

router.get('/', postController.all_posts);
router.get('/user/:id', postController.posts_by_user);
router.get('/:id', postController.get_post);

router.post('/create', authenticateToken, postController.create_post);
router.delete('/:id', authenticateToken, postController.delete_post);

router.put('/:id', authenticateToken, postController.update_post);
router.put('/:id/likes', authenticateToken, postController.like_post);

module.exports = router;