const { authenticateSocket } = require("../middlewares/authMiddleware");
// const { getPushTokensByUserId } = require("../models/expoPush");
// const { sendExpoPushNotification } = require("../services/expoService");
const { sendFCM } = require("../services/FCMService")
const { getPushTokensByUserIdFCM } = require("../models/fcmPush");

const activeCalls = new Map();

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
        socket.on("call-user", async (data) => {
            const { receiverId, offer } = data;
            // Set Busy
            if (activeCalls.has(receiverId)) {
                return socket.emit("user-busy", { receiverId });
            }

            // set RINGING
            activeCalls.set(receiverId, {
                callerId: userId,
                status: "ringing",
            });

            const tokens = await getPushTokensByUserIdFCM(receiverId);

            await sendFCM(tokens, {
                title: 'Incoming Call',
                body: `${socket.user.name} is calling you`,
                channel: 'call',
                data: {
                    type: 'call',
                    callerId: userId,
                    callerName: socket.user.name,
                    callerImage: socket.user.image,
                },
                });

            setTimeout(() => {
                const call = activeCalls.get(receiverId);

                if (call && call.status === "ringing") {
                    activeCalls.delete(receiverId);

                    io.to(`user_${userId}`).emit("call-timeout", {
                        receiverId,
                    });
                }
            }, 30000);

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

            const call = activeCalls.get(userId);
            if (!call) return;

            call.status = "ongoing";

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

            io.to(`user_${targetId}`).emit("ice-candidate", { candidate });
        });
        //REject Call
        socket.on("reject-call", ({ callerId }) => {
            activeCalls.delete(userId);

            io.to(`user_${callerId}`).emit("call-rejected", {
                by: userId,
            });
        });
        //cancel Call
        socket.on("cancel-call", ({ receiverId }) => {
            const call = activeCalls.get(receiverId);

            if (call && call.callerId === userId) {
                activeCalls.delete(receiverId);

                io.to(`user_${receiverId}`).emit("call-canceled", {
                callerId: userId,
                });
            }
            });

        // -------------------------
        // 4. END CALL
        // -------------------------
        socket.on("end-call", (data) => {
            const { targetId } = data;

            activeCalls.delete(userId);
            activeCalls.delete(targetId);

            io.to(`user_${targetId}`).emit("call-ended", {
                from: userId,
            });
        });

        socket.on("disconnect", (data) => {
             const call = activeCalls.get(userId);
            if (call) {
                io.to(`user_${call.callerId}`).emit("call-ended", {
                    reason: "disconnect",
                });
                activeCalls.delete(call.callerId);
                activeCalls.delete(userId);
            }
        });
    });
}

module.exports = callSocket;
