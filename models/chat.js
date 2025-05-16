const pool = require("../config/db")

const createMessage = async (senderId, receiverId, groupID, content) => {
    const query = `INSERT INTO messages (sender_id, receiver_id, group_id, content) VALUES ($1, $2, $3, $4) RETURNING *`
    const result = await pool.query(query, [senderId, receiverId, groupID, content])
    return result.rows[0]
}

const markMessageAsRead = async (messageId, userId) => {
    const query =`INSERT INTO messages_read (message_id, user_id) 
    VALUES ($1, $2) ON CONFLICT (message_id, user_id) DO UPDATE SET read_at = CURRENT_TIMESTAMP`
    await pool.query(query, [messageId, userId])
}

const getMessagesId = async (senderId, receiverId, groupId) => {
    let query
    if (groupId) {
        query =`SELECT * FROm messages where group_id = $1`
        result = await pool.query(query, [groupId])
        return result.rows
    } else {
        query =`SELECT * FROM messages WHERE (sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 AND receiver_id = $2)`
        result = await pool.query(query, [senderId, receiverId])
        return result.rows
    }
}

const readStatus = async (messageId) => {
    const query =`SELECT users.id, users.username, messages_read.read_at FROM messages_read 
    JOIN users On users.id = messages_read.user_id WHERE messages_read.message_id = $1`
    const result = await pool.query(query, [messageId])
    return result.rows[0]
}


module.exports = {createMessage, markMessageAsRead, getMessagesId, readStatus}