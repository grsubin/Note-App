const pool = require("../config/db");

const findOne = async (username) => {
  try {
    const dbUser = (
      await pool.query(
        "SELECT * from users WHERE username = $1 AND deleted_at IS NULL",
        [username]
      )
    ).rows[0];
    if (!dbUser) {
      const error = new Error("User not available.");
      error.code = 404;
      throw error;
    } else {
      return dbUser;
    }
  } catch (error) {
    throw error;
  }
};

module.exports = {
  findOne,
};
