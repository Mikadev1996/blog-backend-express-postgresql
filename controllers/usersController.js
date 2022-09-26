const db = require('../queries');
import {body, validationResult} from ('express-validator');

exports.get_all_users = (req, res, next) => {
    db.query(`SELECT (username, date_joined, picture_url) FROM users;`, (err, results) => {
        if (err) return res.json({error: err});
        res.status(200).json({data: results.rows});
    })
}

exports.sign_up = [
    body('username', '').trim().isLength({min: 1}).escape(),
    body('password', '').trim().isLength({min: 1}).escape(),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.json({error: errors, message: "Form validation error"});
            return;
        }

        db.query(`INSERT INTO users VALUES (${req.body.username}, ${req.body.password}, ${req.body.date_joined}, ${req.body.picture_url});`, (err, results) => {
            if (err) return res.json({error: err});
            res.status(200).json({data: results});
        });
    }
]
exports.get_user = (req, res, next) => {
    const id = req.params.id;
    db.query(`SELECT (username, date_joined, picture_url) FROM users WHERE user_id = ${id}`, (err, results) => {
        if (err) return res.json({error: err})
        res.json({data: results.rows});
    });
}