const pool = require('../config/db');
const {v4: uuidv4} = require('uuid');


//Get all notes
const getAllNotes = async (req, res, next) =>{
    try {

        const userId = req.dbUser.id;
        const dbNotes =  (await pool.query("SELECT * FROM note WHERE user_id = $1 AND deleted_at IS NULL", [userId]));
        let noteList = dbNotes.rows;
        if(dbNotes.rowCount ==0){
            const error = new Error("User not available.");
            error.code = 204;
            throw error;
        } else {
            res.status(200).send(noteList);
        }
        
    } catch (error) {
       console.log(error);
       res.status(!error.code? 500: error.code).send({
        message: error.message
    });
    }

}

//Add a new note
const createNote = async (req, res, next) =>{
    try {

        const userId = req.dbUser.id;
        const {title, body} = req.body;
        const guid = uuidv4();

        const dbNote = await pool.query("INSERT INTO note (title, note_body, created_at, guid, user_id) VALUES ($1, $2, NOW(), $3, $4) RETURNING *",[title, body, guid, userId]);
        const note = dbNote.rows[0];

        res.status(201).send(note);
        
    } catch (error) {
        console.log(error.message);
        res.status(!error.code? 500: error.code).send({
            message: error.message
        });
    }
}


//Find note by Id
const findNoteById = async (req, res, next) =>{
    try {
        
        const userId = req.dbUser.id; 
        const noteId = req.params.id;

        const dbNote = await pool.query("SELECT * FROM note WHERE user_id = $1 AND id =$2 AND deleted_at IS NULL", [userId, noteId]);
        const note = dbNote.rows[0];
        if(!note){
            const error = new Error("No note of that Id for that User.");
            error.code = 404;
            throw error;
        } 
        console.log(note);
        res.status(200).send(note);





    } catch (error) {
        console.log(error.message);
        res.status(!error.code? 500: error.code).send({
            message: error.message
        });
    }
}


//Update an existing note
const updateNoteById = async (req, res, next) =>{
    
    try {

        const userId = req.dbUser.id;
        const noteId = req.params.id;
        const note = req.body;

        const dbNote =  (await pool.query("SELECT title, note_body FROM note WHERE user_id = $1 AND id = $2 AND deleted_at IS NULL ", [userId, noteId])).rows[0];

        if(!dbNote){
            const error = new Error("No note of that Id for that User.");
            error.code = 404;
            throw error;
        } 

        dbNote.title = !note.title? dbNote.title : note.title;
        dbNote.note_body = !note.body ? dbNote.note_body : note.body;

        const updatedNote = (await pool.query("UPDATE note SET updated_at = NOW(), title = $1, note_body = $2 WHERE user_id = $3 AND id =$4 RETURNING *", [dbNote.title, dbNote.note_body, userId, noteId])).rows[0];


        res.status(200).send(updatedNote);


        
    } catch (error) {
        console.log(error.message);
        res.status(!error.code? 500: error.code).send({
            message: error.message
        });
    }
}

//Delete a note
const deleteNoteById = async (req, res, next) =>{

    try {
        
        const userId = req.dbUser.id;
        const noteId = req.params.id;

        const dbNote =  (await pool.query("SELECT * FROM note WHERE user_id = $1 AND id = $2 AND deleted_at IS NULL ", [userId, noteId])).rows[0];

        if(!dbNote){
            const error = new Error("No note of that Id for that User.");
            error.code = 404;
            throw error;
        }

        const deletedNote =  (await pool.query("UPDATE note SET deleted_at = NOW() WHERE user_id = $1 AND id = $2 RETURNING *",[userId, noteId])).rows[0];
        res.status(200).send(deletedNote);

    } catch (error) {
        console.log(error);
        res.status(!error.code? 500: error.code).send({
            message: error.message
        });
    }
}




module.exports = {
    getAllNotes,
    createNote,
    findNoteById,
    updateNoteById,
    deleteNoteById    
};