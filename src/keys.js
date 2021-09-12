require('dotenv').config();

module.exports={
    database: {
        host:process.env.HOST,
        user:process.env.USERS,
        password:process.env.PASSWORD,
        database: process.env.DATA_BASE
    }

}