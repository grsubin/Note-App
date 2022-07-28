const pool = require('../config/db');
const bcrypt = require('bcrypt');
const User = require('../util/user.db.query');
const {v4: uuidv4} = require('uuid');
const crypto = require('crypto');

const login  = async (req, res, next ) => {
    try {

        const dbUser = await User.findOne(req.body.username);

        const passwordIsValid  = bcrypt.compareSync(req.body.password, dbUser.password);
    
        if(!passwordIsValid){
            let error = new Error("Invalid Password!")
            error.code = 401;
            throw error;
        }else{

            const guid = uuidv4();

            const token = crypto.randomBytes(190).toString("base64");
    
            const userAuthInfo = (await pool.query("INSERT INTO user_authentication (user_id, token, created_at, guid) VALUES ($1, $2, NOW(), $3) RETURNING id, token, user_id, guid",[dbUser.id, token, guid])).rows[0];

            console.log(userAuthInfo)
            res.status(200).send({
                id: userAuthInfo.id,
                userId: userAuthInfo.user_id,
                username: dbUser.username,
                email: dbUser.email,
                guid: userAuthInfo.guid,
                accessToken: token
            });

        }
    } catch (error) {

        console.error(error);

        // next(error);
        res.status(!error.code? 500: error.code).send({
            message: error.message
        });
    }
};

const logout = async(req, res, next) => {
    try {
        const token = req.headers["x-access-token"];
        
        const tokenInfo = (await pool.query("UPDATE user_authentication SET deleted_at = NOW() WHERE token = $1 RETURNING id, user_id, guid, created_at, deleted_at ", [token])).rows[0];

        res.status(205).send(tokenInfo);
        


    } catch (error) {

        console.log(error);
        next();
        
    }
}


module.exports = {
    login,
    logout,
    
}