const {createGroup, addGroupMember, createGroupMember} = require("../models/group")

const addCreateGroup = async (req, res) => {
    const userId = req.user.id
    const {name, description} = req.body
    let userIds = req.body.userIds;
    if (typeof userIds === "string") {
        userIds = [userIds];
    }
    const image = req.file ? `upload/groups/${req.file.filename}` : null

    try{

        if (!name || !description) {
            return res.status(404).json({ message: "Name and description are required fields." })
        }
    
        const groupId = await createGroup(name, image, description, userId)


        if (Array.isArray(userIds)) {
            for (const uid of userIds) {
                if (parseInt(uid) !== userId) {
                    await createGroupMember(groupId, parseInt(uid));
                }
            }
        }

        res.status(200).json({
            message: "Group created succesfully",
            data: groupId,
        })
    } catch (err) {
        console.log(err.message)
        res.status(500).json({ message: "An error occurred on the server"})
    }
    

}

module.exports ={addCreateGroup,}