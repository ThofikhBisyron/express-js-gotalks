require('dotenv').config();
const http = require('http')
const {Server} = require("socket.io")
const app = require('./app');
const chatSocket = require('./socket/chatSocket');
const callSocket = require('./socket/callSocket');
const PORT = process.env.PORT 

const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
}) 


chatSocket(io)
callSocket(io)

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});