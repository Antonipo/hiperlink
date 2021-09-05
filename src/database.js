const mysql=require('mysql');
const {promisify} = require('util');

const { database }=require('./keys');

const pool=mysql.createPool(database);

pool.getConnection((err,connection) =>{
    if(err){
        if(err.code === 'PROTOCOL_CONNECTION_LOST'){
            console.error('DATABASE CONECTION WAS CLOSED');
        }
        if(err.code === 'ER_CON_COUNT_ERROR'){
            console.error('DATABASE HAS TO MANY CONNECTIONS');
        }
        if(err.code === 'ECONNREFUSED'){
            console.error('DATABASE CONECTION WAS REFUSED');
        }
    }
    if (connection) connection.release();
    console.log('DB IS CONNECTED');
    return;
});
//Promisify pool querys
pool.query=promisify(pool.query);
module.exports=pool;