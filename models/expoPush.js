const pool = require("../config/db");

const savePushToken = async (userId, token, deviceType = 'android') => {
  await pool.query(
    `
    INSERT INTO user_push_tokens (user_id, expo_push_token, device_type)
    VALUES ($1, $2, $3)
    ON CONFLICT (user_id, device_type)
    DO UPDATE SET
      expo_push_token = EXCLUDED.expo_push_token,
      updated_at = NOW()
    `,
    [userId, token, deviceType]
  );
};

const getPushTokensByUserId = async (userId) => {
  const result = await pool.query(
    `SELECT user_push_token FROM user_push_tokens WHERE user_id = $1`,
    [userId]
  );
  return result.rows.map(r => r.expo_push_token)
};

module.exports = { savePushToken, getPushTokensByUserId };
