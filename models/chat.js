const pool = require("../config/db")

const createMessage = async (senderId, receiverId, groupID, content) => {
    const query = `INSERT INTO messages (sender_id, receiver_id, group_id, content) VALUES ($1, $2, $3, $4) RETURNING *`
    const result = await pool.query(query, [senderId, receiverId, groupID, content])
    return result.rows[0]
}

const markAsRead = async (messageId, userId) => {
    const query =`INSERT INTO messages_read (message_id, user_id) 
    VALUES ($1, $2) DO CONFLICT (message_id, user_id) DO UPDATE SET read_at = CURRENT_TIMESTAMP`
    await pool.query(query, [messageId, userId])
}



module.exports = {createMessage,}