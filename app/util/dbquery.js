const pool = require('../config/db');



const findUserByUsername = async (username) =>{

    const User ={}
    return user =  await pool.query( c, [username]);

   
} 