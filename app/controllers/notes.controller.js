const pool = require('../config/db');
const {v4: uuidv4} = require('uuid');


//Get all notes
const getAllNotes = async (res, req, next) =>{
    try {
        
        // const dbNotes = await pool.query("SELECT * FROM note ")        
        
    } catch (error) {
        console.log(error.message);
        next(error.message);    
    }

}

//Add a new note
const createNote = async (res, req, next) =>{
    try {
        
    } catch (error) {
        console.log(error.message);
        next(error.message); 
    }
}

//Find note by Id
const findNoteById = async (res, req, next) =>{
    try {
        
    } catch (error) {
        console.log(error.message);
        next(error.message); 
    }
}

//Update an existing note
const updateNoteById = async (res, req, next) =>{
    try {
        
    } catch (error) {
        console.log(error.message);
        next(error.message); 
    }
}

//Delete a note
const deleteNoteById = async (res, req, next) =>{
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