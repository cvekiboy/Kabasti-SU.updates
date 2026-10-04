const { initializeApp, cert } = require('firebase-admin/app');
const { getMessaging } = require('firebase-admin/messaging');

// Load credentials from GitHub Secret environment variable
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

initializeApp({
  credential: cert(serviceAccount)
});

const announcementTexts = {
  cyr: {
    title: "Kabasti-SU Обавештење",
    body: process.env.CYR_BODY || "Објављен је нови план одвожења кабастог отпада!"
  },

  default: {
    title: "Kabasti-SU Обавештење",
    body: process.env.CYR_BODY || "Објављен је нови план одвожења кабастог отпада!"
  },

  sr: {
    title: "Kabasti-SU Obaveštenje",
    body: process.env.SR_BODY || "Objavljen je novi plan odvoženja kabastog otpada!"
  },

  en: {
    title: "Kabasti-SU Notification",
    body: process.env.EN_BODY || "A new schedule for bulky waste removal has been announced!"
  },

  hu: {
    title: "Kabasti-SU Bejelentés",
    body: process.env.HU_BODY || "Új tervet jelentettek be a nagyméretű hulladék elszállítására!"
  }
};

async function sendBroadcasts() {
  for (const [lang, text] of Object.entries(announcementTexts)) {
    const message = {
      topic: `SU-announcements_${lang}`,
      fcmOptions: { analyticsLabel: `SU-broadcast-${lang}`},
      notification: { title: text.title, body: text.body },
      data: { type: 'su-announcement' },
      android: { priority: 'normal', ttl: 172800, notification: { channelId: 'su-announcements', icon: 'ann_icon', sound: 'ann_sound.mp3' } }
    };

    try {
      await getMessaging().send(message);
      console.log(`[GitHub Action] Success! Sent to topic SU-announcements_${lang}`);
    } catch (err) {
      console.error(`[GitHub Action] Error! Failed sending to topic SU-announcements_${lang}:`, err);
    }
  }
  process.exit(0);
}

sendBroadcasts();
