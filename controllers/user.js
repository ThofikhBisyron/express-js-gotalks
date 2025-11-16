const { createUser, 
  getUserByEmail, 
  createOtp, 
  verifyUser, 
  getOtpByUserId, 
  deleteOtpByUserId, 
  updateUserNameById, 
  getUserById, 
  updateImageUser,
  updateImgBgUser,
  updateDescription,
  } = require('../models/user');

const { generateToken } = require('../services/jwtService');
const { sendOtpEmail } = require('../services/emailService');
const fs = require("fs")
const path = require("path")

const registerOrLogin = async (req, res) => {
  const { email, phone_number } = req.body;

  try {
    if (!email || !phone_number) {
      return res.status(400).json({ message: "email and telephone number have not been filled in"});
    }

     let cleanPhone = phone_number.replace(/\D/g, '');

    if (cleanPhone.startsWith('0')) {
      cleanPhone = '62' + cleanPhone.slice(1);
    }

    if (!cleanPhone.startsWith('62')) {
      cleanPhone = '62' + cleanPhone;
    }

    let user = await getUserByEmail(email)

    if (!user) {
      user = await createUser(email, cleanPhone)
    }


    const otp = Math.floor(1000 + Math.random() * 9000).toString()
    await createOtp(user.id, otp)
    await sendOtpEmail(email, otp)

    res.status(200).json({
      message: 'Login Succesfully and Otp Was Send To Your Email',
      user: {
        id: user.id,
        email: user.email,
        phoneNumber: user.phone_number,
      }
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' })
  }
};


const verifyOtp = async (req, res) => {
  const {otp, userId} = req.body

  try {
    const otpRecord = await getOtpByUserId(userId)
    if (!otpRecord) {
      return res.status(404).json({message: "OTP not found or already used"})
    }

    const isExpired = new Date() > otpRecord.expired_at
    if (isExpired) {
      await deleteOtpByUserId(userId)
      return res.status(400).json({message: "OTP has expired"})
    }

    if (otp !== otpRecord.otp_code) {
      return res.status(400).json({message: "Invalid OTP"})
    }

    await verifyUser(userId)
    await deleteOtpByUserId(userId)

    const token = generateToken(userId);
    let user = await getUserById(userId)
    console.log(user)
    res.status(200).json({
      message: "OTP successfully verified, account verified",
      token,
      user: {
        id: user.id,
        email: user.email,
      }
    })

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

    const updatedUser = await updateUserNameById(username, id)
    return res.status(200).json({
      message: "Username updated successfully",
      user: updatedUser,
    })
    

  } catch (err) {
    console.log(err)
    return res.status(500).json({message: "An error occurred on the server"})
  }

}

const getUser = async (req, res) => {
  const {id} = req.user

  try{
    if (!id){
      return res.status(400).json({message: "User does not exist"})
    }

    const userProfile = await getUserById(id)
    return res.status(200).json({
      message: "Successfully Get user info",
      user: userProfile
    })
  }catch (err) {
    console.log(err)
    return res.status(500).json({message: "An error occurred on the server"})
  }
}

const updatedImageUser = async (req, res) => {
  const userId = req.user.id
  const image = req.file

  try{
    if (!image){
      return res.status(400).json({message: "No Image Uploaded"})
    }

    const olduser = await getUserById(userId)
    if (olduser.image){
      const oldPath = path.join("uploads/profile", olduser.image)
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath)
      }
    }

    const updateImgUser = await updateImageUser(image.filename, userId)
    const imageUrl = image ? `${process.env.BASE_URL}/uploads/profile/${updateImgUser.image}` : null;

    res.status(200).json({
      message: "Profile image updated successfully",
      data : {  
        ...updateImgUser,
        imageUrl : imageUrl
      }
    })
  }catch(err) {
    console.log(err)
    return res.status(500).json({message: "An error occurred on the server"})
  }
}

const updatedImgBgUser = async (req, res) => {
  const userId = req.user.id
  const imgBg = req.file

  try{
    if (!imgBg) {
      return res.status(400).json({message: "No Image Uploaded"})
    }

    const oldImg = await getUserById(userId)

    if (oldImg.image_background){
      const oldPath = path.join("uploads/profile_background", oldImg.image_background)
      if (fs.existsSync(oldPath)){
        fs.unlinkSync(oldPath)
      }
    }

    const updateImgBg = await updateImgBgUser(imgBg.filename, userId)
    const imageUrl = imgBg ? `${process.env.BASE_URL}/uploads/profile_background/${updateImgBg.image_background}` : null;

    res.status(200).json({
      message: "Background image updated successfully",
      data : {
        ...updateImgBg,
        imageUrl : imageUrl
      }
    })

  }catch(err){
    console.log(err)
    return res.status(500).json({message: "An error occurred on the server"})
  }
}

const updatedDescription = async (req, res) => {
  const userId = req.user.id
  const { description } = req.body

  try{

      if (description.length > 300) {
      return res.status(400).json({ 
        message: "Description cannot exceed 300 characters" 
      });
    }

    const updateDesc = await updateDescription(description, userId)
    return res.status(200).json({
      message : "Description updated successfully",
      data : updateDesc,
    })

  }catch(err){
    console.log(err)
    return res.status(500).json({message: "An error occurred on the server"})
  }
}

module.exports = { registerOrLogin, verifyOtp, updateUsername, getUser, updatedImageUser, updatedImgBgUser, updatedDescription };
