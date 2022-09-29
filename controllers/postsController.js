const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const db = require('../queries');

exports.all_posts = (req, res, next) => {
    const text = 'SELECT posts, users.username, users.picture_url FROM posts INNER JOIN users ON users.user_id = posts.user_id ORDER BY timestamp DESC';
    db.query(text, (err, results) => {
        if (err) return res.json({error: err});
        res.json(results.rows);
    })
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

exports.create_post = (req, res, next) => {

}

exports.delete_post = (req, res, next) => {

}

