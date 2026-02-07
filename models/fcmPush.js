const pool = require("../config/db");

const savePushTokenFCM = async (userId, token, deviceType = 'android') => {
  await pool.query(
    `
    INSERT INTO user_fcm_tokens (user_id, expo_fcm_token, device_type)
    VALUES ($1, $2, $3)
    ON CONFLICT (user_id, device_type)
    DO UPDATE SET
      expo_fcm_token = EXCLUDED.expo_fcm_token,
      updated_at = NOW()
    `,
    [userId, token, deviceType]
  );
};

const getPushTokensByUserIdFCM = async (userId) => {
  const result = await pool.query(
    `SELECT expo_fcm_token FROM user_fcm_tokens WHERE user_id = $1`,
    [userId]
  );
  return result.rows.map(r => r.expo_fcm_token)
};

module.exports = { savePushTokenFCM, getPushTokensByUserIdFCM };
