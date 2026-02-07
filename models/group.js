const { group } = require("console")
const pool = require("../config/db")
const fs = require("fs")
const path = require("path")


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

const deleteGroupById = async (groupId) => {
    const group = await pool.query(`SELECT image from groups wHERE id = $1`, [groupId])

    if (group.rows.length === 0) return

    const image = group.rows[0].image

    if (image) {
      const fullPath = path.join(
        __dirname,
        "..",
        "uploads",
        "groups",
        image
      )

      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath)
      }
    }

    await pool.query(`DELETE fROM groups where id = $1`, [groupId])
}

const removeUserFromGroup = async (groupId, userId) => {
    await pool.query(`DELETE FROM group_members where group_id = $1 AND user_id = $2`, [groupId, userId])
}

const countGroupMember = async (groupId) => {
    const query = `SELECT COUNT(*) FROM group_members WHERE group_id = $1`
    const result = await pool.query(query, [groupId])
    return parseInt(result.rows[0].count)
}

const getGroupByUserId = async (userId) => {
    const query = `SELECT 
    id,
    name,
    image
    FROM groups
    WHERE
    created_by = $1
    `
    const result = await pool.query(query, [userId])
    return result.rows
}

const getGroupMemberIds = async (groupId) => {
  const res = await pool.query(
    `SELECT user_id FROM group_members WHERE group_id = $1`,
    [groupId]
  )
  return res.rows.map(r => r.user_id)
}

const getGroupDetail = async (groupId) => {
  const group = await pool.query(
    `SELECT id, name, image, description FROM groups WHERE id = $1`,
    [groupId]
  )

  const members = await pool.query(
    `
    SELECT u.id, u.username, u.image, gm.role
    FROM group_members gm
    JOIN users u ON u.id = gm.user_id
    WHERE gm.group_id = $1
    `,
    [groupId]
  )

  return {
    group: group.rows[0],
    members: members.rows
  }
}

const updateGroup = async (name, Image, description, groupId) => {
  const query = `UPDATE groups SET (name, image, description) = ($1, $2, $3) WHERE id = $4 RETURNING id, name, image, description`
  const result = await pool.query(query,[name, Image, description, groupId])
  return result.rows[0]
}


module.exports = { createGroup, 
    createGroupMember, 
    isGroupAdmin, 
    isGroupMember, 
    deleteGroupById, 
    removeUserFromGroup, 
    countGroupMember, 
    getGroupByUserId,
    getGroupMemberIds,
    getGroupDetail,
    updateGroup, }