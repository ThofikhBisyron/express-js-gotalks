const pool = require("../config/db")


const createGroup = async (name, Image, description, userId) => {
    const query = `INSERT INTO groups (name, image, description, created_by) VALUES ($1, $2, $3, $4) RETURNING id`
    const result = await pool.query(query, [name, Image, description, userId] )
    const groupId = result.rows[0].id
    await createGroupMember(groupId, userId)
    return groupId

}

const createGroupMember = async (groupId, userId) => {
    await pool.query(`INSERT INTO group_members (group_id, user_id) VALUES ($1, $2)`, [groupId, userId])
}

const addGroupMember = async (groupId, userId) => {
    const query = `INSERT INTO group_members (group_id, user_id) VALUES ($1, $2)`
    const result = await pool.query(query, [groupId, userId])
    return result.rows[0]
}

module.exports = { createGroup, createGroupMember, addGroupMember }