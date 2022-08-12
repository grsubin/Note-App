import { Request, Response, NextFunction } from "express";
import {
  ErrorHandler,
  getErrorMessage,
  getErrorStatusCode,
} from "../util/ErrorHandler";

import pool from "../config/db";

const checkUserExistedById = async (id: number) => {
  const dbUser = (
    await pool.query(
      "SELECT * FROM users WHERE id = $1 AND deleted_at IS NULL",
      [id]
    )
  ).rows[0];

  return dbUser ? true : false;
};

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let tokenHeader: string | undefined = req.headers["authorization"];
    const token = tokenHeader?.split(" ")[1];
    const bearer = tokenHeader?.split(" ")[0];
    if (bearer != "Bearer") {
      let error = new ErrorHandler(403, "Bearer no present");
      throw error;
    }
    if (!token) {
      let error = new ErrorHandler(403, "No token provided!");

      throw error;
    } else {
      const dbUserIdObj = (
        await pool.query(
          "SELECT user_id FROM user_authentication WHERE token = $1 AND deleted_at IS NULL",
          [token]
        )
      ).rows[0];
      const dbUserId = !dbUserIdObj ? null : dbUserIdObj["user_id"];
      if (!dbUserId) {
        let error = new ErrorHandler(401, "unauthorized!");
        throw error;
      } else {
        if (!(await checkUserExistedById(dbUserId))) {
          const error = new ErrorHandler(404, "User not available.");
          throw error;
        } else {
          req.dbUser = (
            await pool.query(
              "SELECT username FROM users WHERE id = $1 AND deleted_at IS NULL",
              [dbUserId]
            )
          ).rows[0];

          req.dbUser.id = dbUserId;

          req.dbUser.token = token;
          console.log(req.dbUser);
        }

        next();
      }
    }
  } catch (error) {
    console.log(error);
    res.status(getErrorStatusCode(error)).send({
      message: getErrorMessage(error),
    });
  }
};

const auth = {
  verifyToken,
  checkUserExistedById,
};

export default auth;
