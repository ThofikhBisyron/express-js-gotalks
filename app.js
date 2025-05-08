const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/user')
const groupRoutes = require('./routes/group')

const app = express();
app.use(cors());
app.use(express.json());

app.use('/user', userRoutes);
app.use('/group', groupRoutes)

app.get('/', (req, res) => {
    res.send('GoTalks API is running...');
  });
  

module.exports = app;