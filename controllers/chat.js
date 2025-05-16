const {createMessage, markMessageAsRead, getMessagesId, readStatus} = require("../models/chat")

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

module.exports = {sendMessage, markAsRead, getMessages, getReadStatus}