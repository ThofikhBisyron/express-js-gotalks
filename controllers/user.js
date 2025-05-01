const { createUser, getUserByEmail, createOtp } = require('../models/user');
const { generateToken } = require('../services/jwtService');
const { sendOtpEmail } = require('../services/emailService')

const registerOrLogin = async (req, res) => {
  console.log(req.body)
  const { email, phone_number } = req.body;

  try {
    let user = await getUserByEmail(email);

    if (!user) {
      user = await createUser(email, phone_number);
    }

    const token = generateToken(user.id);
    const otp = Math.floor(1000 + Math.random() * 9000).toString()
    await createOtp(user.id, otp)
    await sendOtpEmail(email, otp)

    res.status(200).json({
      message: 'Login Succesfully and Otp Was Send To Your Email',
      token,
      user: {
        id: user.id,
        email: user.email
      }
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

module.exports = { registerOrLogin };
