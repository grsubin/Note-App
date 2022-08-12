import pool from "../config/db";
import { v4 as uuidv4 } from "uuid";
import { NextFunction, Request, Response } from "express";
import {
  ErrorHandler,
  getErrorMessage,
  getErrorStatusCode,
} from "../util/ErrorHandler";

//Get all notes
const getAllNotes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.dbUser.id;
    const dbNotes = await pool.query(
      "SELECT * FROM note WHERE user_id = $1 AND deleted_at IS NULL",
      [userId]
    );
    let noteList = dbNotes.rows;
    if (dbNotes.rowCount == 0) {
      const error = new ErrorHandler(204, "No notes for this user.");
      throw error;
    } else {
      res.status(200).send(noteList);
    }
  } catch (error) {
    console.log(error);
    res.status(getErrorStatusCode(error)).send({
      message: getErrorMessage(error),
    });
  }
};

//Add a new note
const createNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.dbUser.id;
    let { title, body, guid, start_date, end_date } = req.body;
    guid = !guid ? uuidv4() : guid;

    const dbNote = await pool.query(
      "INSERT INTO note (title, body, created_at, guid, start_date, end_date, user_id) VALUES ($1, $2, NOW(), $3, $4, $5, $6) RETURNING *",
      [title, body, guid, start_date, end_date, userId]
    );
    const note = dbNote.rows[0];

    res.status(201).send(note);
  } catch (error) {
    console.log(error);
    res.status(getErrorStatusCode(error)).send({
      message: getErrorMessage(error),
    });
  }
};

//Find note by Id
const findNoteById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.dbUser.id;
    const noteId = req.params.id;

    const dbNote = await pool.query(
      "SELECT * FROM note WHERE user_id = $1 AND id =$2 AND deleted_at IS NULL",
      [userId, noteId]
    );
    const note = dbNote.rows[0];
    if (!note) {
      const error = new ErrorHandler(404, "No note of that Id for that User.");

      throw error;
    }
    console.log(note);
    res.status(200).send(note);
  } catch (error) {
    console.log(error);
    res.status(getErrorStatusCode(error)).send({
      message: getErrorMessage(error),
    });
  }
};
const updateNoteById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.dbUser.id;
    const noteId = req.params.id;
    const note = req.body;

    const dbNote = (
      await pool.query(
        "SELECT title, body, start_date, end_date FROM note WHERE user_id = $1 AND id = $2 AND deleted_at IS NULL ",
        [userId, noteId]
      )
    ).rows[0];

    if (!dbNote) {
      const error = new ErrorHandler(404, "No note of that Id for that User.");
      throw error;
    }

    dbNote.title = !note.title ? dbNote.title : note.title;
    dbNote.body = !note.body ? dbNote.body : note.body;
    dbNote.start_date = !note.start_date ? dbNote.start_date : note.start_date;
    dbNote.end_date = !note.end_date ? dbNote.end_date : note.end_date;

    const updatedNote = (
      await pool.query(
        "UPDATE note SET updated_at = NOW(), title = $1, body = $2, start_date = $3, end_date = $4 WHERE user_id = $5 AND id =$6 RETURNING *",
        [
          dbNote.title,
          dbNote.body,
          dbNote.start_date,
          dbNote.end_date,
          userId,
          noteId,
        ]
      )
    ).rows[0];

    res.status(200).send(updatedNote);
  } catch (error) {
    console.log(error);
    res.status(getErrorStatusCode(error)).send({
      message: getErrorMessage(error),
    });
  }
};

//Delete a note
const deleteNoteById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.dbUser.id;
    const noteId = req.params.id;

    const dbNote = (
      await pool.query(
        "SELECT * FROM note WHERE user_id = $1 AND id = $2 AND deleted_at IS NULL ",
        [userId, noteId]
      )
    ).rows[0];

    if (!dbNote) {
      const error = new ErrorHandler(404, "No note of that Id for that User.");
      throw error;
    }

    const deletedNote = (
      await pool.query(
        "UPDATE note SET deleted_at = NOW() WHERE user_id = $1 AND id = $2 RETURNING *",
        [userId, noteId]
      )
    ).rows[0];
    res.status(200).send(deletedNote);
  } catch (error) {
    console.log(error);
    res.status(getErrorStatusCode(error)).send({
      message: getErrorMessage(error),
    });
  }
};

export default {
  getAllNotes,
  createNote,
  findNoteById,
  updateNoteById,
  deleteNoteById,
};
