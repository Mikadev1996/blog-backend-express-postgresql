const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'blog',
    host: 'database',
    database: 'blog',
    password: 'blog1996',
})

module.exports = pool;