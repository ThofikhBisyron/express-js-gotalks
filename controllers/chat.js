const {createMessage} = require("../models/chat")

const sendMessage = async (req, res) => {
    const {receiverId, groupId, content} = req.body
    const senderId = req.user.id

    try{
        const message = await createMessage(senderId, receiverId, groupId, content)

        res.status(201).json({
            message: "Message sent successfully",
            message,
        })


    } catch(err) {
        console.log(err)
        return res.status(500).json({message: "An error occurred on the server"})
    }
}

module.exports = {sendMessage}