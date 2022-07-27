const pool = require('../config/db');


const verifyToken = async (req, res, next) => {

    try {
        let token = req.headers["x-access-token"];
        if(!token){
            let error = new Error("No token provided!")
            error.code = 403;
            throw error;
        }else{
            const dbUserIdObj =  (await pool.query("SELECT user_id FROM user_authentication WHERE token = $1 AND deleted_at IS NULL", [token])).rows[0];
            const dbUserId = !dbUserIdObj? null: dbUserIdObj['user_id'];
            
            if(!dbUserId){
                let error = new Error("unauthorized!");
                error.code = 401;
                throw error;
            }else{

                req.dbUser = (await pool.query("SELECT username FROM users WHERE id = $1", [dbUserId])).rows[0];
                req.dbUser.id = dbUserId;
                next();

            }

        }

    } catch (error) {
        
        console.log(error);
        res.status(!error.code? 500: error.code).send({
            message: error.message
        });
        // next(error.message );
    }

};
const auth = {
    verifyToken: verifyToken
};
module.exports = {
    auth,
};
