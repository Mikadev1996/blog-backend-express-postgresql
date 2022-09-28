const db = require('../queries');
const {body, validationResult} = require('express-validator');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const url = require('../constants');
const bcrypt = require('bcryptjs');

exports.get_all_users = (req, res, next) => {
    db.query(`SELECT (username, date_joined, picture_url) FROM users;`, (err, results) => {
        if (err) return res.json({error: err});
        res.status(200).json(results.rows);
    })
}

exports.log_in = [
    body('username', 'Name must not be empty.').trim().isLength({min: 1}).escape(),
    body('password', 'Password must not be empty.').trim().isLength({min: 1}).escape(),

    function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.json({error: errors, message: "Form validation error"});
            return;
        }

        passport.authenticate("local", { session: false }, (err, user) => {
            if (err || !user) {
                return res.status(401).json({
                    error: err,
                    user: user
                });
            }

            jwt.sign(
                { _id: user._id, username: user.username},
                process.env.JWT_KEY,
                { expiresIn: "30m" },
                (err, token) => {
                    if (err) return res.status(400).json(err);
                    res.json({
                        token: token,
                        user: { _id: user._id, username: user.username},
                    });
                }
            );
        })(req, res);
    }
]

exports.sign_up = [
    body('username', 'Username must not be empty').trim().isLength({min: 1}).escape(),
    body('password', 'Password must not be empty').trim().isLength({min: 1}).escape(),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.json({error: errors});
            return;
        }

        const checkUsernameText = 'SELECT (username) FROM users WHERE username = $1';
        const checkUsernameValue = [req.body.username];

        db.query(checkUsernameText, checkUsernameValue, (err, results) => {
            if (err) return res.json({error: err});
            if (results.rows.length > 0) return res.json({error: 'User already exists'});

            bcrypt.hash(req.body.password, 10, (err, hashedPass) => {
                if (err) return next(err);

                const queryText = 'INSERT INTO users (username, password, date_joined, picture_url) VALUES($1, $2, $3, $4) RETURNING (username, date_joined, picture_url)';
                const queryValues = [req.body.username, hashedPass, req.body.date_joined, req.body.picture_url];

                db.query(queryText, queryValues, (err, results) => {
                    if (err) return res.json({error: err});
                    res.status(200).json(results.rows);
                });
            })
        });



    }
];

exports.log_out = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            res.send({error: err});
            return next(err);
        }
    })
    res.redirect('/');
}

exports.get_user = (req, res, next) => {
    const id = req.params.id;
    db.query(`SELECT (username, date_joined, picture_url) FROM users WHERE user_id = ${id}`, (err, results) => {
        if (err) return res.json({error: err})
        res.json(results.rows);
    });
}