<<<<<<< HEAD
const admin = require('../config/FirebaseAdmin');
console.log(admin.messaging);

async function sendFCM(tokens, payload) {
  if (!tokens || tokens.length === 0) return;

  console.log('📤 SEND FCM PAYLOAD:', {
  tokens,
  payload,
   });
  await admin.messaging().sendEachForMulticast({
    tokens,
    android: {
      priority: 'high',
      // TAMBAHKAN BLOK NOTIFICATION DI SINI
      notification: {
        title: payload.title,
        body: payload.body,
        icon: 'notification_icon', // Nama resource default dari Expo
        imageUrl: payload.imageUrl || 'https://images.icon-icons.com/41/PNG/128/emailmessage_correoelectronic_6969.png',
        color: '#8A2BE2',          // Harus sama dengan di app.json
        channelId: payload.channel || 'chat',
        clickAction: 'OPEN_APP_NOTIFICATION',
      },
    },
    // Data tetap dikirim agar bisa diproses oleh background handler di React Native
    data: {
      title: payload.title,
      body: payload.body,
      channel: payload.channel,
      type: payload.data?.type || '',
      senderId: String(payload.data?.senderId || ''),
    },

    // iOS
    apns: {
      headers: {
        'apns-priority': '10',
      },
      payload: {
        aps: {
          alert: {
            title: payload.title,
            body: payload.body,
          },
          sound: 'default',
          category: payload.category || 'CHAT',
        },
      },
    },

    // // fallback
    // notification: {
    //   title: payload.title,
    //   body: payload.body,
    // },
  });
}


module.exports = { sendFCM };
=======
const admin = require('../config/FirebaseAdmin');
console.log(admin.messaging);

async function sendFCM(tokens, payload) {
  if (!tokens || tokens.length === 0) return;

  console.log('📤 SEND FCM PAYLOAD:', {
  tokens,
  payload,
   });
  await admin.messaging().sendEachForMulticast({
    tokens,
    android: {
      priority: 'high',
      // TAMBAHKAN BLOK NOTIFICATION DI SINI
      notification: {
        title: payload.title,
        body: payload.body,
        icon: 'notification_icon', // Nama resource default dari Expo
        imageUrl: payload.imageUrl || 'https://images.icon-icons.com/41/PNG/128/emailmessage_correoelectronic_6969.png',
        color: '#8A2BE2',          // Harus sama dengan di app.json
        channelId: payload.channel || 'chat',
        clickAction: 'OPEN_APP_NOTIFICATION',
      },
    },
    // Data tetap dikirim agar bisa diproses oleh background handler di React Native
    data: {
      title: payload.title,
      body: payload.body,
      channel: payload.channel,
      type: payload.data?.type || '',
      senderId: String(payload.data?.senderId || ''),
    },

    // iOS
    apns: {
      headers: {
        'apns-priority': '10',
      },
      payload: {
        aps: {
          alert: {
            title: payload.title,
            body: payload.body,
          },
          sound: 'default',
          category: payload.category || 'CHAT',
        },
      },
    },

    // // fallback
    // notification: {
    //   title: payload.title,
    //   body: payload.body,
    // },
  });
}


module.exports = { sendFCM };
>>>>>>> 730e1481799a6bbeeaeb0fc7484ee05bdc00e61d
