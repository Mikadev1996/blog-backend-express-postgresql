const Pool = require('pg').Pool;
const pool = new Pool({
    user: process.env.SQL_NAME,
    host: process.env.SQL_HOST,
    database: 'postgres',
    password: process.env.SQL_PASS,
    ssl: true
})

module.exports = pool;