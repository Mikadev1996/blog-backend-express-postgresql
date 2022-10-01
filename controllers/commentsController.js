const db = require('../db');
const {body, validationResult} = require('express-validator');
const jwt = require('jsonwebtoken')

exports.get_comments = (req, res, next) => {
    const text = 'SELECT comments, users.username, users.picture_url FROM comments INNER JOIN users ON comments.user_id = users.user_id WHERE comments.post_id = $1';
    const values = [req.params.id];
    db.query(text, values, (err, results) => {
        if (err) return res.json({error: err});
        res.json(results.rows);
    })
}

exports.post_comment = [
    body('text', 'Text must not be empty').trim().isLength({min: 1}).escape(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.json({error: errors});
            return;
        }

        jwt.verify(req.token, process.env.JWT_KEY, (err, authData) => {
            if (err) res.json({error: "JWT Authentication Error"});

            const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
            const text = 'INSERT INTO comments (text, timestamp, user_id, post_id) VALUES($1, $2, $3, $4) RETURNING *';
            const values = [req.body.text, date, authData.user_id, req.params.id];
            db.query(text, values, (err, results) => {
                if (err) res.json({error: err});
                res.json(results.rows);
            })
        })
    }
]