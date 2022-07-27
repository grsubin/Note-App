const pool = require('../config/db');
const {v4: uuidv4} = require('uuid');
const bcrypt  = require('bcrypt');
const User = require("../util/user.db.query"); 

//Get all users
const getAllUsers = async(req, res, next) => {
    try {

        const dbUsers = await pool.query("SELECT * FROM users ");

        let userList =[];
        userList = dbUsers.rows;
        if(!userList){
            throw new Error("No User Available.")
        }else{
            res.json(userList);
        }

    } catch (error) {
        console.log(error.message);
        next(error.message);
        
    }

};

//Post new User
const createUser = async(req, res, next) => {
    try {

        let {username , firstName, lastName, email, password, phone} = req.body;
        username = username.toLowerCase();
        firstName = firstName.toLowerCase();
        lastName = lastName.toLowerCase();
        email = email.toLowerCase();
        
        const bcryptedPassword =  bcrypt.hashSync(password, 8);
        const guid = uuidv4();

        //Doesn't add new User if either username/email is repeated and deleted_at is NULL (if deleted_at is NULL then active user exists)
        if ( (await pool.query( "SELECT * FROM users WHERE username = $1 AND deleted_at IS NULL ", [username])).rowCount !== 0 ) {
            throw new Error("username already in use.")
        }else if( (await pool.query("SELECT * FROM users WHERE email = $1 AND deleted_at IS NULL",[email])).rowCount !== 0 ) {
            throw new Error("Email already in use")
        }else {
        const dbUser = await pool.query("INSERT INTO users (username, first_name, last_name, email, password, phone, guid, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) RETURNING username, first_name, last_name, email, password, phone, guid, created_at", [username, firstName, lastName, email, bcryptedPassword, phone, guid]);
        const user = dbUser.rows[0];
        res.json(user);
        // console.log(dbUser);

        // console.log(user);
        }
        
    } catch (error) {

        console.error(error.message);
        next(error.message);
        
    }

};

//Find user by Username
const findUserByUsername = async(req, res, next) =>{

    try {

        const username = req.params.username;

        const dbUser = await User.findOne(username);
        // const dbUser = (await pool.query("SELECT * from users WHERE username = $1", [username] )).rows[0];
        // if(!dbUser){
        //     throw new Error("User not available.");
        // }else{
        //     res.json(dbUser);
        // }
        res.json(dbUser);
    } catch (error) {

        console.error(error.message);
        res.status(!error.code? 500: error.code).send({
            message: error.message
        });
        // next(error.message);
        
    }

};

//Update User
const updateUser = async(req,res,next) => {
try {


    const username = req.params.username;

    //Doesn't all action to other user other than the authorized user.
    console.log(req.dbUser.username, username);
    if(req.dbUser.username != username){
        let error = new Error("Unauthorized action!");
        error.code = 401;
        throw error;
    }
    //Checks if the username is available and is not deleted. 
        const dbUser = (await pool.query("SELECT * from users WHERE username = $1 AND deleted_at IS NULL", [username])).rows[0];
        if(!dbUser){
            throw new Error("User not available.");
        }else{


            // Checks if the username is already taken and is not deleted.

            const user = req.body;
            if((await pool.query("SELECT * FROM users WHERE username = $1 AND deleted_at IS NULL",[user.username])).rows[0]){
                throw new Error("Username already taken.");

            // Checks if the email is already taken and is not deleted.
            }else if ((await pool.query("SELECT * FROM users WHERE email = $1 AND deleted_at IS NULL", [user.email])).rows[0]){
                throw new Error ("Email already in use.")
            } else {
                // Only updates the fields which are provided in the request body else the previous data from the database is used.
                dbUser.username = !user.username ? dbUser.username: user.username;

                dbUser.first_name = !user.firstName ? dbUser.first_name : user.firstName;
                dbUser.last_name = !user.lastName ? dbUser.last_name : user.lastName;
                dbUser.email = !user.email ? dbUser.email : user.email;
                dbUser.password = !user.password ? dbUser.password : bcrypt.hashSync(user.password,8);
                dbUser.phone = !user.phone ? dbUser.phone : user.phone;

                const updatedUser = (await pool.query("UPDATE users SET username = $1, first_name = $2, last_name = $3, email = $4, password = $5, phone = $6, updated_at = NOW() RETURNING *",
                [dbUser.username, dbUser.first_name, dbUser.last_name, dbUser.email, dbUser.password, dbUser.phone])).rows[0];

                console.error(updatedUser);
                res.json(updatedUser);
            }

            
        }
    
    } catch (error) {

        console.log(error);
        next(error.message);
        
    }

};

//Delete User
const deleteUserByUsername = async(req,res,next) =>{
    try {

        const username = req.params.username;
        if(req.dbUsername === username){
            let error = new error("Unauthorized action!");
            error.code = 401;
            throw error;
        }
        const dbUser =  (await pool.query("UPDATE users SET deleted_at = NOW() WHERE username = $1 AND deleted_at IS NULL RETURNING *", [username])).rows[0];
        if(!dbUser){
            throw new Error("Username not found.");
        }else{
            
            res.json(dbUser);
        }
        
        
    } catch (error) {

        console.error(error.message);
        next(error.message);
        
    }
};

module.exports = {
    createUser,
    getAllUsers,
    findUserByUsername,
    deleteUserByUsername,
    updateUser,
};