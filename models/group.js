const pool = require("../config/db")


const createGroup = async (name, Image, description, userId) => {
    const query = `INSERT INTO groups (name, image, description, created_by) VALUES ($1, $2, $3, $4) RETURNING id`
    const result = await pool.query(query, [name, Image, description, userId] )
    const groupId = result.rows[0].id
    await createGroupMember(groupId, userId, "admin")
    return groupId

}

const createGroupMember = async (groupId, userId, role = "member") => {
    await pool.query(`INSERT INTO group_members (group_id, user_id, role) VALUES ($1, $2, $3)`, [groupId, userId, role])
}

const isGroupAdmin = async (groupId, userId) => {
    const query = `SELECT role FROM group_members where group_id = $1 AND user_id = $2`
    const result = await pool.query(query, [groupId, userId])
    return result.rows.length > 0 && result.rows[0].role === "admin" 
}

const isGroupMember = async (groupId, userId) => {
    const query = `SELECT * FROM group_members where group_id = $1 AND user_id = $2`
    const result = await pool.query(query, [groupId, userId])
    return result.rows.length > 0
}

const removeGroup = async ()


module.exports = { createGroup, createGroupMember, isGroupAdmin, isGroupMember }