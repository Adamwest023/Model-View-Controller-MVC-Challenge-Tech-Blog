//require router
const router = require('express').Router();

//require routes
const userRoutes = require('./user-routes');
const postRoutes = require('./post-routes');
const commentRoutes = require('./comment-routes');

// routes read through express
router.use('/users', userRoutes);
router.use('/posts',postRoutes);
router.use('/comments', commentRoutes);

module.exports = router;