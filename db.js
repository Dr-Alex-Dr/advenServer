const mysql = require("mysql2");
require('dotenv').config();

const pool = mysql
.createPool({
    host: process.env.MYSQL_HOST, // HOST NAME
    user: process.env.MYSQL_USER, // USER NAME
    database: process.env.MYSQL_DARABASE, // DATABASE NAME
    password: process.env.MYSQL_PASSWORD, // DATABASE PASSWORD
});
pool.query('select 1 + 1', (err, rows) => { 
    console.log('err' + err)
    console.log('rows' + rows);
});
  
module.exports = pool;

