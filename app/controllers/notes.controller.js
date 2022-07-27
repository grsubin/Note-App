const pool = require('../config/db');
const {v4: uuidv4} = require('uuid');


//Get all notes
const getAllNotes = async (req, res, next) =>{
    try {
        
        const user = req.dbUser;
        console.log(user)

        // const dbNotes = await pool.query("SELECT * FROM note WHERE  ")        
        
    } catch (error) {
        console.log(error.message);
        next(error.message);    
    }

}

//Add a new note
const createNote = async (req, res, next) =>{
    try {
        
    } catch (error) {
        console.log(error.message);
        next(error.message); 
    }
}

//Find note by Id
const findNoteById = async (req, res, next) =>{
    try {
        
    } catch (error) {
        console.log(error.message);
        next(error.message); 
    }
}

//Update an existing note
const updateNoteById = async (req, res, next) =>{
    try {
        
    } catch (error) {
        console.log(error.message);
        next(error.message); 
    }
}

//Delete a note
const deleteNoteById = async (req, res, next) =>{
    try {
        
    } catch (error) {
        console.log(error.message);
        next(error.message); 
    }
}




module.exports = {
    getAllNotes,
    createNote,
    findNoteById,
    updateNoteById,
    deleteNoteById    
};