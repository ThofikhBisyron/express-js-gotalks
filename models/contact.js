const pool = require('../config/db')

const createOrUpdateContact = async (userId, contactId) => {
    const query = 'INSERT INTO contacts (user_id, contact_id) VALUSE ($1, $2) ON CONFLICT (user_id, contact_id) DO NOTHING RETURNING *'
    const result = await pool.query(query,[userId, contactId])
    return result.rows[0]
}

module.exports = { createOrUpdateContact }