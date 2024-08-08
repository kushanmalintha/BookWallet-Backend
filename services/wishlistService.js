const db = require("../config/dbConfig");

const getWishlistByUserId = async (userId) => {
    try {
        const query = `
            SELECT b.title, b.ISBN10, b.ISBN13, b.publication_date, b.description,b.pages, b.author, b.rating, b.genre, b.imageUrl,b.resource
            FROM wishlist w
            JOIN book b ON w.book_id = b.book_id
            WHERE w.user_id = ?;
        `;
        const [rows] = await db.query(query, [userId]); // Destructure to get the rows array
        console.log('Database Query Result:', rows); // Log only the rows

        if (rows.length > 0) {
            return rows; // Return the rows directly
        } else {
            return []; // Return an empty array if no rows are found
        }
        
    } catch (error) {
        throw new Error('Error fetching wishlist: ' + error.message);
    }

    
};
const getBookIdWithISBN = async (isbn) => {
    try {
        const query = `SELECT book_id FROM book WHERE ISBN10 = ? OR ISBN13 = ?`;
        const [results] = await db.query(query, [isbn, isbn]);

        if (results.length === 0) {
            return [];
        }

        return results;
    } catch (error) {
        throw new Error('Error fetching book Id: ' + error.message);
    }
};

const addToWishlist = async (userId, bookId) => {
    try {
        const query = `INSERT INTO wishlist (user_id, book_id) VALUES (?, ?)`;
        await db.query(query, [userId, bookId]);
    } catch (error) {
        throw new Error('Error adding to wishlist: ' + error.message);
    }
};


const postWishlistBook = async (req, res) => {
    const { bookId, userId } = req.params;

    if (!userId || !bookId) {
        return res.status(400).json({ message: 'User ID or Book ID is required' });
    }

    try {
        // Check if the book is already in the user's wishlist
        const checkQuery = `SELECT * FROM wishlist WHERE user_id = ? AND book_id = ?`;
        const [rows] = await db.execute(checkQuery, [userId, bookId]);

        if (rows.length > 0) {
            return res.status(409).json({ message: 'Book already in the wishlist' });
        }

        // Insert the book into the wishlist
        const insertQuery = `INSERT INTO wishlist (user_id, book_id) VALUES (?, ?)`;
        await db.execute(insertQuery, [userId, bookId]);

        res.status(201).json({ message: 'Book added to the wishlist successfully' });
    } catch (error) {
        console.error('Error adding book to wishlist:', error);
        res.status(500).json({ message: 'Server error while adding to wishlist', error: error.message });
    }
};
const removeFromWishlist = async (userId, bookId) => {
    try {
        // Convert userId and bookId to numbers
        userId = parseInt(userId, 10);
        bookId = parseInt(bookId, 10);

        // Check if conversion was successful
        if (isNaN(userId) || isNaN(bookId)) {
            throw new Error('User ID and Book ID must be valid numbers');
        }

        console.log('Removing from wishlist:', { userId, bookId });

        const query = `DELETE FROM wishlist WHERE user_id = ? AND book_id = ?`;
        const [result] = await db.query(query, [userId, bookId]);

        if (result.affectedRows === 0) {
            throw new Error('No record found to delete');
        }

        console.log('Deletion result:', result);
    } catch (error) {
        console.error('Error removing from wishlist:', error.message);
        throw new Error('Error removing from wishlist: ' + error.message);
    }
};


module.exports = { 
    getWishlistByUserId,
    getBookIdWithISBN,
    addToWishlist,
    postWishlistBook ,
    removeFromWishlist,
};
