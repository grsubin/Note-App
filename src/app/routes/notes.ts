import { Router } from "express";
import notesController from "../controllers/notes.controller";
import auth from "../middleware/auth";

const router = Router();
//GET (/api/notes)
router.get("/", auth.verifyToken, notesController.getAllNotes);
//POST (/api/notes)
router.post("/", auth.verifyToken, notesController.createNote);
//GET (/api/notes/:id)
router.get("/:id", auth.verifyToken, notesController.findNoteById);
//PUT (/api/notes/:id)
router.put("/:id", auth.verifyToken, notesController.updateNoteById);
//DELETE (/api/notes/:id)
router.delete("/:id", auth.verifyToken, notesController.deleteNoteById);

export default router;
