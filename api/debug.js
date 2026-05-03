// Debug endpoint to check environment variables and configuration
module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Check environment variables
    const envVars = {
      SMTP_HOST: process.env.SMTP_HOST || 'mail.privateemail.com',
      SMTP_PORT: process.env.SMTP_PORT || '587',
      SMTP_USER: process.env.SMTP_USER || 'no-reply@hasagold.store',
      SMTP_PASS: process.env.SMTP_PASS ? '[HIDDEN]' : '[NOT SET]'
    };

    // Test nodemailer import
    const nodemailer = require('nodemailer');

    // Test transporter creation
    let transporterTest = 'OK';
    try {
      const testTransporter = nodemailer.createTransport({
        host: envVars.SMTP_HOST,
        port: parseInt(envVars.SMTP_PORT),
        secure: false,
        auth: {
          user: envVars.SMTP_USER,
          pass: process.env.SMTP_PASS || '@hasa1234G'
        }
      });
    } catch (error) {
      transporterTest = 'ERROR: ' + error.message;
    }

    res.json({
      success: true,
      environment: envVars,
      nodemailer: 'LOADED',
      transporter: transporterTest,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Debug endpoint error:', error);
    res.status(500).json({ 
      error: 'Debug error: ' + error.message,
      details: error.toString()
    });
  }
}
