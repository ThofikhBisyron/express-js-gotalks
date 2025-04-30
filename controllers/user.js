const { createUser, getUserByEmail } = require('../models/user');
const { generateToken } = require('../services/jwtService');

const registerOrLogin = async (req, res) => {
    console.log(req.body)
  const { email, password } = req.body;

  try {
    let user = await getUserByEmail(email);

    if (!user) {
      user = await createUser(email, password);
    }

    const token = generateToken(user.id);

    res.status(200).json({
      message: 'Berhasil login atau register',
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
