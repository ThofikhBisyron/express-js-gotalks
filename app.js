const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/user')
const groupRoutes = require('./routes/group')
const chatRoutes = require('./routes/chat')
const contactRoutes = require('./routes/contact')
const expoPushRoutes = require('./routes/expoPush')
const fcmPushRoutes = require(`./routes/fcmPush`)
const path = require("path")

const app = express();
app.use(cors());
app.use(express.json());  

app.use('/user', userRoutes);
app.use('/group', groupRoutes)
app.use('/message', chatRoutes)
app.use('/contact', contactRoutes)
app.use('/expo', expoPushRoutes)
app.use('/fcm', fcmPushRoutes)
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

app.get('/', (req, res) => {
    res.send('GoTalks API is running...');
  });
  

module.exports = app;