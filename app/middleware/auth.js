const pool = require('../config/db');

const checkUserExistedById = async(id) => {
        
    const dbUser = (await pool.query("SELECT * FROM users WHERE id = $1 AND deleted_at IS NULL", [id])).rows[0];    

    return dbUser? true : false;

};

const verifyToken = async (req, res, next) => {

    try {
        let tokenHeader = req.headers["authorization"];
        const token = tokenHeader.split(" ")[1];
        const bearer = tokenHeader.split(" ")[0];
        if(bearer != "Bearer"){
            let error = new Error("Bearer no present");
            error.code = 403;
            throw error;
        }
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
                

                if(!(await checkUserExistedById(dbUserId))){
                    const error = new Error("User not available.");
                    error.code = 404;
                    throw error;

                }else{

                    req.dbUser = (await pool.query("SELECT username FROM users WHERE id = $1 AND deleted_at IS NULL", [dbUserId])).rows[0];
                    console.log(req.dbUser);
                    req.dbUser.id = dbUserId;

                    req.dbUser.token = token;
                 
                }

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
    verifyToken: verifyToken,
    checkUserExistedById, checkUserExistedById
};
module.exports = {
    auth,
};
