const { savePushToken } = require("../models/expoPush");

const registerPushToken = async (req, res) => {
  try {
    const userId = req.user.id;
    const { expoPushToken, deviceType } = req.body;

    if (!expoPushToken) {
      return res.status(400).json({ message: "Push token required" });
    }

    await savePushToken(userId, expoPushToken, deviceType);

    res.json({ message: "Push token saved" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save push token" });
  }
};


module.exports = { registerPushToken };
