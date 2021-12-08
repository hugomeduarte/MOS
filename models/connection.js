var pg = require('pg');

const connectionString = "postgres://szbeeelkkrkhab:acc10b2ee03d9bc62970557ffbe256a6d33c6dfe5172748b303ca386171650bc@ec2-54-154-101-45.eu-west-1.compute.amazonaws.com:5432/dfquoriur5t8td"
const Pool = pg.Pool
const pool = new Pool({
    connectionString,
    max: 10,
    ssl: {
        require: true, 
        rejectUnauthorized: false
    }
})

module.exports = pool;