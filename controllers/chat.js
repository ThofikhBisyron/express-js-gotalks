const {createMessage, markMessageAsRead, getMessagesId, readStatus, getChatList} = require("../models/chat")

const sendMessage = async (req, res) => {
    const {receiverId, groupId, content} = req.body
    const senderId = req.user.id

    try{
        const message = await createMessage(senderId, receiverId, groupId, content)

        res.status(201).json({
            message: "Message sent successfully",
            data: message,
        })


    } catch(err) {
        console.log(err)
        return res.status(500).json({message: "An error occurred on the server"})
    }
}

const markAsRead = async (req, res) => {
    const {messageId} = req.params
    const userId = req.user.id

    try{
        await markMessageAsRead(messageId, userId)
        res.status(200).json({message: "Message marked as read"})
    }
     catch(err) {
        console.log(err)
        res.status(500).json({message: "An error occurred on the server"})
    }
}

const getMessages = async (req, res) => {
    const {receiverId, groupId} = req.query
    const senderId = req.user.id

    try {
        const messages = await getMessagesId(senderId, receiverId, groupId)
        res.status(200).json({
            messages: "Succesfully get Messages",
            data: messages
        })
    }
     catch(err){
        console.log(err)
        return res.status(500).json({message: "An error occurred on the server"})
    }
}

const getReadStatus = async (req, res) => {
    const {messageId} = req.params

    try {
        const message = await readStatus(messageId)
        res.status(200).json({
            message: "Succesfully get read message",
            data: message
        })
    } catch(err){
        console.log(err)
        return res.status(500).json({message: "An error occurred on the server"})
    }
}

const getChatListbyId = async (req, res) => {
    const {id} = req.user

    try{
        const chatList = await getChatList(id)

        const urlImage = `${process.env.BASE_URL}/uploads/profile/`
        const urlImageGroup = `${process.env.BASE_URL}/uploads/groups/` 

        const formatChatList = chatList.map(chat => {
            let image = null
            let group_image = chat.group_image


            if (chat.type === 'user') {
                image = chat.image ? urlImage + chat.image : null
            } else if (chat.type === 'group') {
                group_image = chat.group_image ? urlImageGroup + chat.group_image : null
            }

            return {
                ...chat,
                image,
                group_image
            }
        })

        res.status(200).json({
            message: "Succesfully get chat list",
            data: formatChatList
        })
    } catch(err){
        console.log(err)
        return res.status(500).json({message: "An error occurred on the server"})
    }
}

module.exports = {sendMessage, markAsRead, getMessages, getReadStatus, getChatListbyId}