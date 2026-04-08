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

/* ---- Global handles used by db.js and all pages ---- */
const _db   = firebase.firestore();   // Firestore database
const _auth = firebase.auth();        // Firebase Authentication

/*
  NOTE: Offline persistence (enablePersistence / enableIndexedDbPersistence)
  has been intentionally removed. It caused:
  - Deprecation warnings in the browser console
  - Conflicts when multiple tabs are open
  - Stale data being served from cache instead of live Firestore
  Firestore will fetch fresh data from the server on every page load,
  which is the correct behaviour for a multi-device admin system.
*/
