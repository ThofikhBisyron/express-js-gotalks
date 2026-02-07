const { savePushTokenFCM } = require("../models/fcmPush");

const registerPushTokenFCM = async (req, res) => {
  try {
    const userId = req.user.id;
    const { fcmPushToken, deviceType } = req.body;

    if (!fcmPushToken) {
      return res.status(400).json({ message: "Push token required" });
    }

    await savePushTokenFCM(userId, fcmPushToken, deviceType);

    res.json({ message: "Push token saved" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save push token" });
  }
};


module.exports = { registerPushTokenFCM };
