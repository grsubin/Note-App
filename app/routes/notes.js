
const router = require('express').Router();
const notesController = require('../controllers/notes.controller');


//GET (/api/notes)
router.get("/", notesController.getAllNotes);
//POST (/api/notes)
router.post("/", notesController.createNote);
//GET (/api/notes/:username)
router.get("/:username", notesController.findNoteById)
//PUT (/api/notes/:username)
router.put("/:username", notesController.updateNoteById);
//DELETE (/api/notes/:username)
router.delete("/:username",notesController.deleteNoteById);

module.exports = router;