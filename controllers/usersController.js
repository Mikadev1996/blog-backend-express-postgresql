const db = require('../queries');


exports.create_user = (req, res, next) => {
    const id = req.params.id;
    db.query('SELECT * FROM users', (err, results) => {
        if (err) return res.json({error: err});
        res.json({data: results.rows});
    })
}