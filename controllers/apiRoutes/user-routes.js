//calling router 
const router = require('express').Router();
//calling our User Model 
const { User, Post, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

//Get /api/users
router.get('/', (req, res) => {
    User.findAll({
        attributes: { exclude: ['password'] }
    })
        //return all found data to a json object
        .then(dbUserData => res.json(dbUserData))
        //catch any errors and return the error message as a json object
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

//Get /api/users/1
router.get('/:id', (req, res) => {
    //for a single return we use the .findOne() method
    User.findOne({
        attributes: { exclude: ['password'] },
        //parameters for our search
        where: {
            id: req.params.id
        },
        include: [
            {
                model: Post,
                attributes: ['id', 'title', 'content', 'created_at']
            },
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: Post,
                    attributes: ['title']
                }
            }
        ]
    })
        //returning our search to the json object
        .then(dbUserData => {
            //if no data at that id 
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id' });
                return;
            }
            res.json(dbUserData);
        })
        //catch any errors
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});


//POST api user
router.post('/', (req, res) => {
    User.create({
        username: req.body.username,
        password: req.body.password
    })
        //adds information to the dbUserData json object
        .then(dbUserData => {
            req.session.save(() => {
                req.session.user_id = dbUserData.id;
                req.session.username = dbUserData.username;
                req.session.loggedIn = true;

                res.json(dbUserData);
            })
        })
        //catch any errors
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.post('/login', (req, res) => {
    User.findOne({
        where: {
            email: res.body.username
        }
    }).then(dbUserData => {
        if (!dbUserData) {
            res.status(400).json({ message: 'No user with that username!' });
            return;
        }
        //the checkPassword instance method() is called on the dbUserData as a conditional statement 
        const validPassword = dbUserData.checkPassword(req.body.password);
        //control statement 
        if (!validPassword) {
            res.status(400).json({ message: 'Incorrect password!' });
            return;
        }
        req.session.save(() => {
            req.session.user_id = dbUserData.id,
            req.session.username = dbUserData.username,
            req.session.loggedIn = true,
            res.json({ user: dbUserData, message: "You are now logged in!" })
        });
    });
});


//logout route
router.post('/logout', withAuth, (req, res) => {
    if (req.session.loggedIn) {
        req.session.destroy(() => {
            res.status(204).end();
        })
    } else {
        res.status(404).end();
    }
});

//update user
router.put('/:id', withAuth, (req, res) => {
    User.update(req.body, {
        individualHooks: true,
        where: {
            id: req.params.id
        }
    }).then(dbUserData => {
        if (!dbUserData) {
            res.status(404).json({ message: 'No user found with this id' });
            return;
        }
        res.json(dbUserData);
    })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});


//delete user
router.delete('/:id', withAuth, (req, res) => {
    User.destroy({
        id: req.params.id
    }).then(dbUserData => {
        if (!dbUserData) {
            res.status(404).json({ message: 'No user found with this id' });
            return;
        }
        res.json(dbUserData)
    })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});


module.exports = router;



