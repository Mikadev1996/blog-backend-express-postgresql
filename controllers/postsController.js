const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const db = require('../db');

exports.all_posts = (req, res, next) => {
    const text = 'SELECT posts.post_id, posts.text, posts.likes, posts.timestamp, posts.edited, posts.published, users.user_id, users.username, users.picture_url FROM posts INNER JOIN users ON users.user_id = posts.user_id ORDER BY timestamp DESC';
    db.query(text, (err, results) => {
        if (err) return res.json({error: err});
        res.json(results.rows);
    })
}

exports.get_post = (req, res, next) => {
    const text = 'SELECT * FROM posts WHERE post_id = $1';
    const text2 = 'SELECT comments.text, comments.timestamp, users.username, users.picture_url FROM comments INNER JOIN users ON comments.user_id = users.user_id WHERE comments.post_id = $1';
    const values = [req.params.id];
    Promise.all([db.query(text, values), db.query(text2, values)])
        .then(([results1, results2]) => {
            res.json({post: results1.rows[0], comments: results2.rows});
        })
        .catch(err => res.json({error: err}));
}

exports.posts_by_user = (req, res, next) => {
    const id = req.params.id;
    const text = 'SELECT posts, users.username, users.picture_url FROM posts INNER JOIN users ON users.user_id = posts.user_id WHERE users.user_id = $1 ORDER BY timestamp DESC';
    const values = [id];
    db.query(text, values, (err, results) => {
        if (err) return res.json({error: err});
        res.json(results.rows);
    })
}


exports.create_post = [
    body('text', 'Text must not be empty').trim().isLength({min: 1}).escape(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.json({error: errors});
            return;
        }

        jwt.verify(req.token, process.env.JWT_KEY, (err, authData) => {
            if (err) res.json({error: "JWT Authentication Error"});

            const text = 'INSERT INTO posts (text, likes, timestamp, edited, published, user_id) VALUES($1, 0, $2, false, true, $3) RETURNING *';
            const values = [req.body.text, Date.now(), authData.user_id];

            db.query(text, values, (err, results) => {
                if (err) return res.json({error: err});
                res.json(results.rows);
            })
        })
    }
]

exports.delete_post = (req, res, next) => {
    jwt.verify(req.token, process.env.JWT_KEY, (err, authData) => {
        if (err) res.json({error: "JWT Authentication Error"});

        const text = 'DELETE FROM posts WHERE post_id = $1 RETURNING *';
        const values = [req.params.id];

        db.query(text, values, (err, results) => {
            if (err) return res.json({error: err});
            res.json(results.rows);
        })
    })
}

exports.update_post = [
    body('text', 'Text must not be empty').trim().isLength({min: 1}).escape(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.json({error: errors});
            return;
        }

        const text = 'UPDATE posts SET text = $1, edited = true, published = $2 WHERE post_id = $3 RETURNING *';
        const values = [req.body.text, req.body.published, req.params.id];

        db.query(text, values, (err, results) => {
            if (err) return res.json({error: err});
            res.json(results.rows);
        })
    }
]

exports.like_post = (req, res, next) => {
    const text = 'UPDATE posts SET likes = likes + 1 WHERE post_id = $1 RETURNING *';
    const values = [req.params.id];

    db.query(text, values, (err, results) => {
        if (err) return res.json({error: err});
        res.json(results.rows);
    })
}
