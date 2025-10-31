const jwt = require('jsonwebtoken');
const pool = require('../config/db')

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) return res.status(401).json({ message: 'Access token required' })

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' })
    req.user = user;
    next();
  });
};

const requireVerifiedUser = async (req, res, next) => {
  const { id } = req.user;
  const result = await pool.query(`SELECT is_verified FROM users WHERE id = $1`, [id])
  if (!result.rows[0].is_verified) {
    return res.status(403).json({ message: 'User has not verified OTP' });
  }
  next()
};

const authenticateSocket = (socket, next) => {
  try {
    const token = socket.handshake.auth?.token || socket.handshake.query?.token
    if (!token) return next(new Error('Access token required'))

    const user = jwt.verify(token, process.env.JWT_SECRET)
    socket.user = user
    next();
  } catch (err) {
    console.log('Socket auth failed:', err.message)
    next(new Error('Invalid token'))
  }
};
module.exports = {authenticateToken, requireVerifiedUser, authenticateSocket};
