
const router = require('express').Router();
const notesController = require('../controllers/notes.controller');
const {auth} = require('../middleware/auth');

//GET (/api/notes)
router.get("/",[auth.verifyToken], notesController.getAllNotes);
//POST (/api/notes)
router.post("/",[auth.verifyToken], notesController.createNote);
//GET (/api/notes/:username)
router.get("/:username",[auth.verifyToken], notesController.findNoteById)
//PUT (/api/notes/:username)
router.put("/:username",[auth.verifyToken], notesController.updateNoteById);
//DELETE (/api/notes/:username)
router.delete("/:username",[auth.verifyToken],notesController.deleteNoteById);

module.exports = router;