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
  apiKey: "AIzaSyBOEutlV1_c73mmaOqDOjGLvk5CDf_jQD4",
  authDomain: "namuspaces-main.firebaseapp.com",
  projectId: "namuspaces-main",
  storageBucket: "namuspaces-main.firebasestorage.app",
  messagingSenderId: "133991567956",
  appId: "1:133991567956:web:0a75d2ff695dcb135113c1"
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
