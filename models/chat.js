const pool = require("../config/db")

const createMessage = async (senderId, receiverId, groupID, content) => {
    const query = `INSERT INTO messages (sender_id, receiver_id, group_id, content) VALUES ($1, $2, $3, $4) RETURNING *`
    const result = await pool.query(query, [senderId, receiverId, groupID, content])
    return result.rows[0]
}



module.exports = {createMessage,}