const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'mikadev',
    host: 'localhost',
    database: 'blog',
    password: '6287',
    port: 5432,
})

module.exports = pool;