const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'blog@blog-express-database',
    host: 'blog-express-database.postgres.database.azure.com',
    database: 'postgres',
    password: process.env.SQL_PASS,
    ssl: true
})

module.exports = pool;