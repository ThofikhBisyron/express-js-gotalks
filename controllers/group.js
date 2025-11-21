const {createGroup, 
    createGroupMember, 
    isGroupAdmin, isGroupMember, 
    deleteGroupById, 
    removeUserFromGroup, 
    countGroupMember,
    getGroupByUserId} = require("../models/group")

const addCreateGroup = async (req, res) => {
    const userId = req.user.id
    const {name, description} = req.body
    let userIds = req.body.userIds;
    if (typeof userIds === "string") {
        userIds = [userIds];
    }
    const image = req.file ? req.file.filename : null

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
        const imageUrl = image ? `${process.env.BASE_URL}/uploads/groups/${image}` : null;

        res.status(200).json({
            message: "Group created succesfully",
            data: {
                id: groupId,
                name,
                description,
                image: imageUrl,
            }
        })
    } catch (err) {
        console.log(err.message)
        res.status(500).json({ message: "An error occurred on the server"})
    }
    

}

const addMemberGroup = async (req, res) => {
    const userId = req.user.id
    const {groupId, userIds} = req.body

    try {
        if (!groupId || !userIds) {
            return res.status(400).json({message: "Enter group and username"})
        }

        const isAdmin = await isGroupAdmin(groupId, userId)
            if (!isAdmin) {
                return res.status(403).json({message: "Only admin can add member"})
            }
        
        const alreadyMember = await isGroupMember(groupId, userIds)
            if (alreadyMember) {
                return res.status(400).json({message: "There are already users who have entered the group"})
            }

        await createGroupMember(groupId, userIds, "member")

        res.status(200).json({message: "Member added successfully"})

    } catch (err) {
        console.log(err)
        res.status(500).json({message: "An error occurred on the server"})
    }


}

const deleteGroup = async (req, res) => {
    userId = req.user.id
    const {groupId} = req.params

    try {
        const isAdmin = await isGroupAdmin(groupId, userId)
        if (!isAdmin) {
            return res.status(403).json({message: "Only Admin can delete group"})
        }

        await deleteGroupById(groupId)

        return res.status(200).json({message: "Group deleted successfully"})


    } catch(err) {
        console.log(err)
        return res.status(500).json({message: "An error occurred on the server"})
    }
}

const leaveGroup = async (req, res) => {
    const userId = req.user.id
    const {groupId} = req.params

    try {
        await removeUserFromGroup(groupId, userId)

        const memberCOunt = await countGroupMember(groupId)
        if (memberCOunt === 0) {
            await deleteGroupById(groupId)
        }

        return res.status(200).json({message: "Left group successfully"})


    } catch(err){
        console.log(err)
        return res.status(500).json({message: "An error occurred on the server"})
    }
}

const getGroup = async (req, res) => {
    const userId = req.user.id

    try{
        const group = await getGroupByUserId(userId)

        if (group.length === 0) {
            return res.status(200).json({ message : "no groups have been created"})
        }

        res.status(200).json({
            message : "Group list successfully retrieved",
            data : group,
        })

    }catch(err){
        console.log(err)
        return res.status(500).json({message: "An error occurred on the server"})
    }
}

module.exports ={addCreateGroup, addMemberGroup, deleteGroup, leaveGroup, getGroup}