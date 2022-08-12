import pool from "../config/db";
import { ErrorHandler } from "./ErrorHandler";

const findOne = async (username: string) => {
  try {
    const dbUser = (
      await pool.query(
        "SELECT * from users WHERE username = $1 AND deleted_at IS NULL",
        [username]
      )
    ).rows[0];
    if (!dbUser) {
      const error = new ErrorHandler(404, "User not available.");
      throw error;
    } else {
      return dbUser;
    }
  } catch (error) {
    throw error;
  }
};

export default {
  findOne,
};
