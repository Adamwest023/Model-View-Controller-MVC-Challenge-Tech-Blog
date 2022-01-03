const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

//route to get to the dashboard
router.get('/', withAuth, (req, res) => {
    //will render the dashboard handlebars if the loggedIn is a truthy
    Post.findAll({
        where: {
            // use the ID from the session
            user_id: req.session.user_id
        },
        attributes: [
            'id',
            'title',
            'content',
            'created_at',
        ],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
        .then(dbPostData => {
            //serialize data before passing to template
            const post = dbPostData.map(post => post.get({ plain: true }));
            res.render('dashboard', { post, loggedIn: true });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.get('/add-post', withAuth, (req, res) => {
    res.render('add-post', { loggedIn: true });
});

router.get('/edit/:id', withAuth, (req, res) => {
    Post.findOne(req.params.id, {
        attributes: [
            'id',
            'title',
            'content',
            'created_at',
        ],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: "No post found at this id" });
                return;
            }
            const post = dbPostData.get({ plain: true });

            res.render('edit-post', {
                post,
                loggedIn: req.session.loggedIn
            });
        })
        .catch(err => {
            res.status(500).json(err);
        });
});

module.exports = router;