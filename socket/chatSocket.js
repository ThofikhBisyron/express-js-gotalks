const { createMessage, getMessagesId, getChatList} = require("../models/chat")
const { authenticateSocket } = require("../middlewares/authMiddleware")

function chatSocket(io) {
    io.use(authenticateSocket)

    io.on('connection', (socket) =>{
        const userId = socket.user.id
        console.log(`User ${userId} connected`)
        socket.emit('authenticated', { message: 'User authenticated successfully', userId })

        socket.join(`user_${userId}`)

        socket.on('join_chat', (data) => {
            const {groupId} = data
            if (groupId) {
                socket.join(`group_${groupId}`)
                console.log(`User ${userId} joined group_${groupId}`)
            }
        })

        socket.on(`send_message`, async (data) =>{
            const {receiverId, groupId, content} = data

            try{
                const message = await createMessage(userId, receiverId, groupId, content)
                
                socket.emit('message_sent', message)

                 if (groupId) {
                    io.to(`group_${groupId}`).emit('new_message', message)
                    } else {
                    if (receiverId === userId) {
                        io.to(`user_${userId}`).emit('new_message', message)
                    } else {
                        io.to(`user_${receiverId}`).emit('new_message', message)
                        io.to(`user_${userId}`).emit('new_message', message)
                    }
                }

            }catch(err){
                console.error(`Error sending message:`, err)
                socket.emit(`error_message`, {message : `failed to sent message`})
            }
        })
        
        socket.on(`get_message`, async (data) => {
            const {receiverId, groupId} = data
            const message = await getMessagesId(userId, receiverId, groupId)
            socket.emit(`message_history`, message)
        })

        socket.on(`get_chat_list`, async () => {
            console.log('User', userId, 'requested chat list')
            const chatList = await getChatList(userId)
            socket.emit(`chat_list`, chatList)
        })

        socket.on(`disconnect`, () =>{
            console.log(`User ${userId} disconnect`)
        })

    })
} 

module.exports = chatSocket