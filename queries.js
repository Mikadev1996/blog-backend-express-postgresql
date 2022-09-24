const Pool = require('pg').Pool;
const pool = new Pool({
    name: 'mikadev',
    host: 'localhost',
    database: 'api',
    password: '1996',
    port: 5432
})

module.exports = pool;