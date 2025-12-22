const pool = require("../config/db")

const createMessage = async (senderId, receiverId, groupId, content) => {
    const query = `INSERT INTO messages (sender_id, receiver_id, group_id, content) VALUES ($1, $2, $3, $4) RETURNING *`
    const result = await pool.query(query, [senderId, receiverId, groupId, content])
    const message = result.rows[0]

    if (groupId) {
        await updateChatList(senderId, groupId, 'group', message.id, false)

         const members = await pool.query(
            `SELECT user_id FROM group_members WHERE group_id = $1 AND user_id != $2`,
            [groupId, senderId]
        )

        for (const member of members.rows) {
            await updateChatList(member.user_id, groupId, 'group', message.id, true)
        }

    } else {
         if (senderId === receiverId) {
        await updateChatList(senderId, receiverId, 'user', message.id, false);
        } else {
        await updateChatList(senderId, receiverId, 'user', message.id, false);
        await updateChatList(receiverId, senderId, 'user', message.id, true);
        }
    }
    return message
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
        query =`SELECT * FROM messages WHERE (sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 AND receiver_id = $1)`
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

const updateChatList = async (userId, targetId, type, messageId, incrementUnread = false) => {
    const updatePart = incrementUnread ? 'unread_count = chat_list.unread_count + 1' : 'unread_count = 0'
    
    await pool.query(
        `INSERT INTO chat_list (user_id, target_id, type, last_message_id, updated_at, unread_count)
        VALUES ($1, $2, $3, $4, NOW(), 1)
        ON CONFLICT (user_id, target_id, type)
        DO UPDATE SET last_message_id = $4, updated_at = NOW(), ${updatePart}`,[userId, targetId, type, messageId]
    )
}

const getChatList = async (userId) => {
    const query = `SELECT 
        cl.id,
        cl.type,
        cl.target_id,
        cl.unread_count,
        u.username AS target_name,
        g.name AS group_name,
        u.image,
        g.image AS group_image,
        m.content AS last_message,
        m.created_at AS last_time
        FROM chat_list cl
        LEFT JOIN users u ON cl.type = 'user' AND cl.target_id = u.id
        LEFT JOIN groups g ON cl.type = 'group' AND cl.target_id = g.id
        LEFT JOIN messages m ON cl.last_message_id = m.id
        WHERE cl.user_id = $1
        ORDER BY m.created_at DESC;`
    const result = await pool.query(query, [userId])
    return result.rows
}


module.exports = {createMessage, markMessageAsRead, getMessagesId, readStatus, getChatList}