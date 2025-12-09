const { authenticateSocket } = require("../middlewares/authMiddleware");

function callSocket(io) {

    // Pakai middleware autentikasi
    io.use(authenticateSocket);

    io.on("connection", (socket) => {
        const userId = socket.user.id;
        console.log(`CallSocket: User ${userId} connected`);

        // Join ke room personal (sama seperti chat)
        socket.join(`user_${userId}`);

        // -------------------------
        // 1. CALL USER (mengirim OFFER WebRTC)
        // -------------------------
        socket.on("call-user", (data) => {
            const { receiverId, offer } = data;
            const room = io.sockets.adapter.rooms.get(`user_${receiverId}`);
            if (!room) {
                return socket.emit("user-offline", { receiverId });
            }


            console.log(`User ${userId} is calling user ${receiverId}`);

            io.to(`user_${receiverId}`).emit("incoming-call", {
                callerId: userId,
                callerName: socket.user.name, 
                callerImage: socket.user.image,
                offer,
            });
        });

        // -------------------------
        // 2. ANSWER CALL (mengirim ANSWER WebRTC)
        // -------------------------
        socket.on("answer-call", (data) => {
            const { callerId, answer } = data;

            console.log(`User ${userId} answered call from ${callerId}`);

            io.to(`user_${callerId}`).emit("call-answered", {
                answer,
                receiverId: userId,
            });
        });

        // -------------------------
        // 3. ICE CANDIDATE SIGNALING (WAJIB UNTUK VIDEO CALL)
        // -------------------------
        socket.on("ice-candidate", (data) => {
            const { targetId, candidate } = data;

            io.to(`user_${targetId}`).emit("ice-candidate", {
                candidate,
            });
        });

        // -------------------------
        // 4. END CALL
        // -------------------------
        socket.on("end-call", (data) => {
            const { targetId } = data;

            console.log(`User ${userId} ended call with ${targetId}`);

            io.to(`user_${targetId}`).emit("call-ended", {
                from: userId,
            });
        });

        socket.on("disconnect", () => {
            console.log(`CallSocket: User ${userId} disconnected`);
        });
    });
}

module.exports = callSocket;
