const db = require("../config/dbConfig");

class NotificationService {
  async getNotificationsForUser(userId) {
    const query = `
      SELECT 
        s.user_id AS sharedUserId,
        r.review_id,
        u.username AS sharedUserName,
        b.title AS bookName,
        s.date,
        s.time
      FROM 
        shares s
      INNER JOIN 
        reviewed r ON s.review_id = r.review_id
      INNER JOIN 
        user u ON s.user_id = u.user_id
      INNER JOIN 
        book b ON r.book_id = b.book_id
      WHERE 
        r.user_id = ?
      ORDER BY 
        s.date DESC, s.time DESC;
    `;

    const notifications = await db.execute(query, [userId]);

    return notifications[0].map(notification => ({
      message: `${notification.sharedUserName} shared your review on ${notification.bookName}`,
      reviewId: notification.review_id,
      sharedUserId: notification.sharedUserId,
      sharedUserName: notification.sharedUserName,
      bookName: notification.bookName,
      date: notification.date,
      time: notification.time
    }));
  }

  async getLikesNotificationsForUser(userId) {
    const likeNotificationsQuery = `
      SELECT 
        l.user_id AS likedUserId,
        r.review_id,
        u.username AS likedUserName,
        b.title AS bookName,
        l.date,
        l.time
      FROM 
        likes l
      INNER JOIN 
        reviewed r ON l.review_id = r.review_id
      INNER JOIN 
        user u ON l.user_id = u.user_id
      INNER JOIN 
        book b ON r.book_id = b.book_id
      WHERE 
        r.user_id = ?
      ORDER BY 
        l.date DESC, l.time DESC;
    `;
    const likeNotifications = await db.execute(likeNotificationsQuery, [userId]);

    return likeNotifications[0].map(notification => ({
      message: `${notification.likedUserName} liked your review on ${notification.bookName}`,
      reviewId: notification.review_id,
      likedUserId: notification.likedUserId,
      likedUserName: notification.likedUserName,
      bookName: notification.bookName,
      date: notification.date,
      time: notification.time
    }));
  }
}

module.exports = new NotificationService();