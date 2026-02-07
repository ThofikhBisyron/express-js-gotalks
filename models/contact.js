const pool = require('../config/db')

const createOrUpdateContact = async (userId, contactId) => {
    const query = 'INSERT INTO contacts (user_id, contact_id) VALUES ($1, $2) ON CONFLICT (user_id, contact_id) DO NOTHING RETURNING *'
    const result = await pool.query(query,[userId, contactId])
    return result.rows[0]
}

const findPhoneNumberUser = async (phoneNumber) => {
    const query = 'SELECT id, phone_number from users where phone_number = ANY($1::text[])'
    const result = await pool.query(query, [phoneNumber])
    return result.rows
}

const getDetailContact = async (userId) => {
    const query = `SELECT 
    contacts.id, 
    contacts.user_id, 
    contacts.contact_id, 
    users.username, 
    users.phone_number,
    users.image 
    FROM contacts 
    JOIN users ON contacts.contact_id = users.id 
    WHERE contacts.user_id = $1`
    const result = await pool.query(query, [userId])
    return result.rows

}
module.exports = { createOrUpdateContact, findPhoneNumberUser, getDetailContact }