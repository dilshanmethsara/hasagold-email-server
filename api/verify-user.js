// Vercel Serverless Function: Mark user as emailVerified via Firebase Admin SDK
// Called after our custom OTP verification passes during signup.
// This is the ROOT FIX for Google login overwriting manual accounts.

const { initializeApp, getApps, cert } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');

// Initialize Firebase Admin once per cold start
if (!getApps().length) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');
    if (serviceAccount.project_id) {
      initializeApp({ credential: cert(serviceAccount) });
      console.log('✅ Firebase Admin initialized');
    } else {
      console.error('❌ FIREBASE_SERVICE_ACCOUNT env var is missing or invalid');
    }
  } catch (e) {
    console.error('❌ Failed to parse FIREBASE_SERVICE_ACCOUNT:', e.message);
  }
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    if (!getApps().length) {
      return res.status(500).json({ error: 'Firebase Admin not initialized. FIREBASE_SERVICE_ACCOUNT env var missing.' });
    }

    const { uid, idToken } = req.body;
    if (!uid || !idToken) {
      return res.status(400).json({ error: 'uid and idToken are required' });
    }

    const adminAuth = getAuth();

    // Verify the ID token to authenticate the request
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    if (decodedToken.uid !== uid) {
      return res.status(403).json({ error: 'Unauthorized: token uid does not match requested uid' });
    }

    // THE KEY FIX: Mark emailVerified=true in Firebase Auth using Admin SDK
    // Firebase client SDK cannot do this - only Admin SDK can.
    // Once this is set, Google Sign-In with same email will LINK (not overwrite) the account.
    await adminAuth.updateUser(uid, { emailVerified: true });

    console.log(`✅ emailVerified=true set for uid: ${uid}`);
    return res.status(200).json({ success: true, message: 'User email verified in Firebase Auth' });

  } catch (error) {
    console.error('❌ verify-user error:', error.message);
    return res.status(500).json({ error: 'Failed: ' + error.message });
  }
};
