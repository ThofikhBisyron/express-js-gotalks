<<<<<<< HEAD
async function sendExpoPushNotification(tokens, title, body, data = {}) {
    if (!tokens || tokens.length === 0) return;
  const messages = tokens.map(token => ({
    to: token,
    sound: "default",
    priority: 'high',
    channelId: 'chat',
    title,
    body,
    data,
  }));

  const response = await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(messages),
  });

  const result = await response.json();
  console.log(result)
  return result;
}

=======
async function sendExpoPushNotification(tokens, title, body, data = {}) {
    if (!tokens || tokens.length === 0) return;
  const messages = tokens.map(token => ({
    to: token,
    sound: "default",
    priority: 'high',
    channelId: 'chat',
    title,
    body,
    data,
  }));

  const response = await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(messages),
  });

  const result = await response.json();
  console.log(result)
  return result;
}

>>>>>>> 730e1481799a6bbeeaeb0fc7484ee05bdc00e61d
module.exports = { sendExpoPushNotification };