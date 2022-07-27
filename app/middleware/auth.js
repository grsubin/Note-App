const pool = require('../config/db');


const verifyToken = async (req, res, next) => {

    try {
        let token = req.header["x-access-token"];
        if(!token){
            let error = new Error("No token provided!")
            error.code = 403;
            throw error;
        }else{
            const dbUserId =  (await pool.query("SELECT user_id FROM user_authentication WHERE token = $1 ", [token])).rows[0];
            if(!dbUserId){
                let error = new Error("unauthorized!");
                error.code = 401;
                throw error;
            }else{

                req.dbUsername = (await pool.query("SELECT username FROM users WHERE id = $1", [dbUserId])).rows[0];
                
                next();

            }

        }

    } catch (error) {
        
        console.log(error);
        res.status(!error.code? 500: error.code).send({
            message: error.message
        });
    }

};
const auth = {
    verifyToken: verifyToken
};
module.exports = {
    auth,
};
