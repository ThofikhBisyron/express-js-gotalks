const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/user')


const app = express();
app.use(cors());
app.use(express.json());

app.use('/user', userRoutes);

app.get('/', (req, res) => {
    res.send('GoTalks API is running...');
  });
  

module.exports = app;