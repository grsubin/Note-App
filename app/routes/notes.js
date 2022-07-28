
const router = require('express').Router();
const notesController = require('../controllers/notes.controller');
const {auth} = require('../middleware/auth');

//GET (/api/notes)
router.get("/",[auth.verifyToken], notesController.getAllNotes);
//POST (/api/notes)
router.post("/",[auth.verifyToken], notesController.createNote);
//GET (/api/notes/:id)
router.get("/:id",[auth.verifyToken], notesController.findNoteById)
//PUT (/api/notes/:id)
router.put("/:id",[auth.verifyToken], notesController.updateNoteById);
//DELETE (/api/notes/:id)
router.delete("/:id",[auth.verifyToken],notesController.deleteNoteById);

module.exports = router;