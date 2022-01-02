//calls router
const router = require('express').Router();
const sequelize = require('../config/connection');

//call models 
const { Post, User, Comment } = require('../models')

//homepage route
router.get('/', (req, res) => {
    console.log(req.session);
    //using a sequelize query to return all post to populate out homepage template
    //using the Post Model
    Post.findAll({
        //finding with certain attributes 
        attributes: [
            'id',
            'title',
            'content',
            'created_at',
        ],
        //joins the Comment Model at username and model User at username
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
            const posts = dbPostData.map(post => post.get({ plain: true }));
            //pass a single post object into the homepage template
            res.render('homepage', {
                posts,
                loggedIn: req.session.loggedIn
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

//get a single post 
router.get('/post/:id', (req, res) => {
    Post.findOne({

        where: {
            id: req.params.id
        },
        attributes: [
            'id',
            'title',
            'content',
            'created_at',
            [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
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
                res.status(404).json({ message: 'No post found with this id' });
                return;
            }
            // serialize the data
            const post = dbPostData.get({ plain: true });
            // pass data to template
            res.render('single-post', {
                post,
                //requires the user to be logged in 
                loggedIn: req.session.loggedIn
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

//route for login template
router.get('/login', (req, res) => {
    //if you are logged in go home 
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }
    res.render('login');
});

module.exports = router;