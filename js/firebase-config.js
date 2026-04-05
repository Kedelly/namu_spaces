/**
 * ============================================================
 * NAMU SPACES — Firebase Configuration (firebase-config.js)
 *
 * HOW TO FILL THIS IN:
 * 1. Go to https://console.firebase.google.com
 * 2. Open your project → Project Settings (⚙️ gear icon)
 * 3. Scroll to "Your apps" → select your web app
 * 4. Copy the firebaseConfig object values below
 * ============================================================
 */

const firebaseConfig = {
  apiKey:            "PASTE_YOUR_API_KEY_HERE",
  authDomain:        "PASTE_YOUR_AUTH_DOMAIN_HERE",
  projectId:         "PASTE_YOUR_PROJECT_ID_HERE",
  storageBucket:     "PASTE_YOUR_STORAGE_BUCKET_HERE",
  messagingSenderId: "PASTE_YOUR_MESSAGING_SENDER_ID_HERE",
  appId:             "PASTE_YOUR_APP_ID_HERE"
};

/* ---- Initialise Firebase ---- */
firebase.initializeApp(firebaseConfig);

/* ---- Export global handles used by db.js ---- */
const _db   = firebase.firestore();   // Firestore database
const _auth = firebase.auth();        // Firebase Authentication

/* ---- Optional: enable Firestore offline persistence ---- */
/* This caches Firestore data locally so pages load even with no connection.
   Comment out if you experience issues (requires IndexedDB support).       */
_db.enablePersistence({ synchronizeTabs: true })
   .catch(err => {
     if (err.code === 'failed-precondition') {
       console.warn('[Firestore] Persistence disabled — multiple tabs open.');
     } else if (err.code === 'unimplemented') {
       console.warn('[Firestore] Persistence not supported in this browser.');
     }
   });
