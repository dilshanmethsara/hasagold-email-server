const OTPAuth = require('otpauth');

module.exports = async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { code } = req.body;
  const secret = process.env.ADMIN_2FA_SECRET;

  if (!code) {
    return res.status(400).json({ error: 'Code is required' });
  }

  if (!secret) {
    return res.status(500).json({ error: 'Server configuration error: 2FA Secret missing' });
  }

  try {
    const totp = new OTPAuth.TOTP({
      issuer: "HasaGold",
      label: "Admin",
      algorithm: "SHA1",
      digits: 6,
      period: 30,
      secret: secret,
    });

    const delta = totp.validate({ token: code, window: 1 }); // Allow window of 1 for time sync issues
    
    if (delta !== null) {
      return res.status(200).json({
        success: true,
        message: '2FA verified successfully'
      });
    } else {
      return res.status(401).json({
        success: false,
        error: 'Invalid 2FA code'
      });
    }
  } catch (error) {
    console.error('❌ verify-2fa error:', error.message);
    return res.status(500).json({ error: 'Verification failed: ' + error.message });
  }
};
