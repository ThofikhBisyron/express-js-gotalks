const { createUser, getUserByEmail, createOtp, verifyUser, getOtpByUserId, deleteOtpByUserId, updateUserNameById } = require('../models/user');
const { generateToken } = require('../services/jwtService');
const { sendOtpEmail } = require('../services/emailService');

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
    res.status(500).json({ message: 'Terjadi kesalahan pada server' })
  }
};


const verifyOtp = async (req, res) => {
  const {id} = req.user
  const {otp} = req.body

  try {
    const otpRecord = await getOtpByUserId(id)
    if (!otpRecord) {
      return res.status(404).json({message: "OTP not found or already used"})
    }

    const isExpired = new Date() > otpRecord.expired_at
    if (isExpired) {
      await deleteOtpByUserId(id)
      return res.status(400).json({message: "OTP has expired"})
    }

    if (otp !== otpRecord.otp_code) {
      return res.status(400).json({message: "Invalid OTP"})
    }

    await verifyUser(id)
    await deleteOtpByUserId(id)

    res.status(200).json({message: "OTP successfully verified, account verified"})

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'An error occurred on the server' })
  }
}

const updateUsername = async (req, res) => {
  const {id} = req.user
  const {username} = req.body

  try {
    if (!username) {
      return res.status(400).json({message: "Username cannot be empty"})
    }

    const updatedUser = await updateUserNameById(id, username)
    return res.status(200).json({
      message: "Username updated successfully",
      user: updatedUser,
    })
    

  } catch (err) {
    console.log(err)
    return res.status(500).json({message: "An error occurred on the server"})
  }

}
module.exports = { registerOrLogin, verifyOtp, updateUsername };
