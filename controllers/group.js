<<<<<<< HEAD
const {createGroup, 
    createGroupMember, 
    isGroupAdmin, isGroupMember, 
    deleteGroupById, 
    removeUserFromGroup, 
    countGroupMember,
    getGroupByUserId,
    getGroupDetail,
    updateGroup,} = require("../models/group")
const fs = require("fs")
const path = require("path")

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

const getGroupDetails = async (req, res) => {
    const userId = req.user.id
    const {groupId} = req.params

    try{
        const isMember = await isGroupMember(groupId, userId)
        if (!isMember) {
            return res.status(403).json({ message: "You are not a member of this group" })
        }

        const data = await getGroupDetail(groupId)

        if (!data.group) {
            return res.status(404).json({ message: "Group Not Found"})
        }

        return res.status(200).json({
            message: "Group detail retrieved successfully",
            data
        })
    }catch(err){
        console.log(err)
        return res.status(500).json({message: "An error occurred on the server"})
    }
}

const editGroup = async (req, res) => {
    const userId = req.user.id
    const { groupId } = req.params
    const { name, description } = req.body
    const newImage = req.file ? req.file.filename : null

    try{
        const isAdmin = await isGroupAdmin(groupId, userId)
        if (!isAdmin) {
        return res.status(403).json({ message: "Only admin can edit group" })
        }

        const data = await getGroupDetail(groupId)
        if (!data.group) {
        return res.status(404).json({ message: "Group not found" })
        }

        const oldImage = data.group.image

        let finalImage = oldImage

        if (newImage) {
        if (oldImage) {
            const oldImagePath = path.join(
            __dirname,
            "..",
            "uploads/groups",
            oldImage
            )

            if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath)
            }
        }

        finalImage = newImage
        }

        const updatedGroup = await updateGroup(
        name,
        finalImage,
        description,
        groupId
        )

        return res.status(200).json({
        message: "Group updated successfully",
        data: {
            id: updatedGroup.id,
            name: updatedGroup.name,
            description: updatedGroup.description,
            image: updatedGroup.image
            ? `${process.env.BASE_URL}/uploads/groups/${updatedGroup.image}`
            : null
        }
        })

    }catch(err){
        console.log(err)
        return res.status(500).json({message: "An error occurred on the server"})
    }
}
=======
const {createGroup, 
    createGroupMember, 
    isGroupAdmin, isGroupMember, 
    deleteGroupById, 
    removeUserFromGroup, 
    countGroupMember,
    getGroupByUserId,
    getGroupDetail,
    updateGroup,} = require("../models/group")
const fs = require("fs")
const path = require("path")

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

const getGroupDetails = async (req, res) => {
    const userId = req.user.id
    const {groupId} = req.params

    try{
        const isMember = await isGroupMember(groupId, userId)
        if (!isMember) {
            return res.status(403).json({ message: "You are not a member of this group" })
        }

        const data = await getGroupDetail(groupId)

        if (!data.group) {
            return res.status(404).json({ message: "Group Not Found"})
        }

        return res.status(200).json({
            message: "Group detail retrieved successfully",
            data
        })
    }catch(err){
        console.log(err)
        return res.status(500).json({message: "An error occurred on the server"})
    }
}

const editGroup = async (req, res) => {
    const userId = req.user.id
    const { groupId } = req.params
    const { name, description } = req.body
    const newImage = req.file ? req.file.filename : null

    try{
        const isAdmin = await isGroupAdmin(groupId, userId)
        if (!isAdmin) {
        return res.status(403).json({ message: "Only admin can edit group" })
        }

        const data = await getGroupDetail(groupId)
        if (!data.group) {
        return res.status(404).json({ message: "Group not found" })
        }

        const oldImage = data.group.image

        let finalImage = oldImage

        if (newImage) {
        if (oldImage) {
            const oldImagePath = path.join(
            __dirname,
            "..",
            "uploads/groups",
            oldImage
            )

            if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath)
            }
        }

        finalImage = newImage
        }

        const updatedGroup = await updateGroup(
        name,
        finalImage,
        description,
        groupId
        )

        return res.status(200).json({
        message: "Group updated successfully",
        data: {
            id: updatedGroup.id,
            name: updatedGroup.name,
            description: updatedGroup.description,
            image: updatedGroup.image
            ? `${process.env.BASE_URL}/uploads/groups/${updatedGroup.image}`
            : null
        }
        })

    }catch(err){
        console.log(err)
        return res.status(500).json({message: "An error occurred on the server"})
    }
}
>>>>>>> 730e1481799a6bbeeaeb0fc7484ee05bdc00e61d
module.exports ={addCreateGroup, addMemberGroup, deleteGroup, leaveGroup, getGroup, getGroupDetails, editGroup}