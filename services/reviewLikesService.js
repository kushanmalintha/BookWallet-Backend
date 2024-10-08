const db = require("../config/dbConfig");

const getUsersWhoLikedReview = async (reviewId) => {
  try {
    const query = `
            SELECT useR.user_id, user.username
            FROM likes
            JOIN user ON likes.user_id = user.user_id
            WHERE likes.review_id = ?
        `;

    const [rows] = await db.query(query, [reviewId]);
    console.log("Query result:", rows);

    return rows;
  } catch (error) {
    console.error("Error executing query:", error.message);
    throw new Error(
      `Error retrieving users who liked review: ${error.message}`
    );
  }
};
const likeReview = async (reviewId, userId) => {
  try {
    // Check if the user exists
    const checkUserSql = "SELECT user_id FROM user WHERE user_id = ?";
    const [checkUserRows] = await db.query(checkUserSql, [userId]);

    if (checkUserRows.length === 0) {
      throw new Error("User does not exist.");
    }

    // Insert the like
    const insertLikeSql = `
      INSERT INTO likes (review_id, user_id, date, time)
      VALUES (?, ?, ?, ?)`;

    // Get the current date and time
    const now = new Date();
    const date = now.toISOString().split("T")[0]; // YYYY-MM-DD
    const time = now.toTimeString().split(" ")[0]; // HH:MM:SS

    const [likeResult] = await db.query(insertLikeSql, [
      reviewId,
      userId,
      date,
      time,
    ]);

    return likeResult.affectedRows > 0;
  } catch (err) {
    console.error("Database error in likeReview: ", err.message);
    throw new Error("Database error: " + err.message);
  }
};

const unlikeReview = async (reviewId, userId) => {
  const query = "DELETE FROM likes WHERE review_id = ? AND user_id = ?";
  const values = [reviewId, userId];

  await db.query(query, values);
};

const getLikeCount = async (reviewId) => {
  const query = "SELECT COUNT(*) AS like_count FROM likes WHERE review_id = ?";
  const [rows] = await db.query(query, [reviewId]);
  return rows[0].like_count;
};

const checkIfLiked = async (userId, reviewId) => {
  try {
    const query = `
      SELECT COUNT(*) as count
      FROM likes
      WHERE user_id = ? AND review_id = ?`;
    const [rows] = await db.query(query, [userId, reviewId]);
    return rows[0].count > 0;
  } catch (err) {
    console.error("Database error in checkIfLiked: ", err.message);
    throw new Error("Database error: " + err.message);
  }
};

const getCommentsByReviewId = (reviewId) => {
  return new Promise((resolve, reject) => {
    const query =
      "SELECT * FROM comments WHERE review_id = ? ORDER BY date DESC";
    connection.query(query, [reviewId], (error, results) => {
      if (error) {
        return reject(new Error(`Error fetching comments: ${error.message}`));
      }
      resolve(results);
    });
  });
};

module.exports = {
  getUsersWhoLikedReview,
  likeReview,
  unlikeReview,
  getLikeCount,
  checkIfLiked,
  getCommentsByReviewId,
};
