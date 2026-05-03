// Vercel Serverless Function for Email Sending
const nodemailer = require('nodemailer');

// OTP verification email template - Beautiful HASA GOLD STORE design
const getOTPEmailTemplate = (userName, otpCode, userEmail) => {
  // Format customer name
  const customerName = userName && userName !== 'Customer' ? userName : 'Valued Customer';
  
  return {
    subject: '🔐 HASA GOLD STORE - Verify Your Email',
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your HASA GOLD STORE Account</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
          
          * { margin: 0; padding: 0; box-sizing: border-box; }
          
          body { 
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            background: linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%); 
            padding: 24px; 
            line-height: 1.6;
            color: #1e293b;
          }
          
          .email-container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: #ffffff; 
            border-radius: 24px; 
            overflow: hidden; 
            box-shadow: 0 20px 40px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.1);
          }
          
          .email-header { 
            background: linear-gradient(135deg, #10B981 0%, #059669 50%, #DC2626 100%); 
            padding: 48px 32px; 
            text-align: center; 
            position: relative;
            overflow: hidden;
          }
          
          .email-header::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: linear-gradient(45deg, transparent, rgba(255,255,255,0.15), transparent);
            transform: rotate(45deg);
            animation: shimmer 4s infinite;
          }
          
          @keyframes shimmer {
            0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
            100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
          }
          
          .brand-logo { 
            font-size: 2.5rem; 
            font-weight: 900; 
            color: white; 
            margin-bottom: 8px;
            text-shadow: 0 2px 4px rgba(0,0,0,0.2);
            letter-spacing: -0.5px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
          }
          
          .brand-tagline { 
            color: rgba(255,255,255,0.95); 
            font-size: 1rem; 
            font-weight: 600;
            text-shadow: 0 1px 2px rgba(0,0,0,0.2);
            letter-spacing: 0.5px;
          }
          
          .email-content { 
            padding: 48px 40px; 
            background: #ffffff;
          }
          
          .otp-code {
            background: linear-gradient(135deg, #10B981 0%, #059669 50%, #DC2626 100%);
            color: white;
            font-size: 2rem;
            font-weight: 800;
            padding: 20px 30px;
            border-radius: 16px;
            text-align: center;
            letter-spacing: 8px;
            margin: 32px 0;
            box-shadow: 0 8px 24px rgba(16,185,129,0.3);
            border: 2px solid rgba(255,255,255,0.1);
          }
          
          .otp-label {
            color: #64748B;
            font-size: 0.875rem;
            font-weight: 500;
            margin-bottom: 12px;
            text-align: center;
          }
          
          .instructions {
            background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%);
            border: 1px solid #F59E0B;
            border-radius: 12px;
            padding: 20px;
            margin: 24px 0;
          }
          
          .instructions-title {
            color: #92400E;
            font-weight: 700;
            margin-bottom: 12px;
            font-size: 1.125rem;
          }
          
          .instructions-list {
            color: #78350F;
            font-size: 0.95rem;
            line-height: 1.6;
          }
          
          .instructions-list li {
            padding: 4px 0;
            position: relative;
            padding-left: 20px;
          }
          
          .instructions-list li::before {
            content: '•';
            position: absolute;
            left: 0;
            color: #F59E0B;
            font-weight: bold;
          }
          
          .security-note {
            background: #FEF2F2;
            border: 1px solid #FCA5A5;
            border-radius: 8px;
            padding: 16px;
            margin: 16px 0;
            font-size: 0.875rem;
            color: #7C2D12;
          }
          
          .email-footer { 
            background: #F8FAFC;
            border-top: 1px solid #E2E8F0;
            padding: 32px 40px; 
            text-align: center; 
          }
          
          .footer-brand { 
            font-size: 1.25rem; 
            font-weight: 800; 
            margin-bottom: 16px;
            background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          
          .footer-links { 
            display: flex;
            justify-content: center;
            gap: 24px;
            margin: 16px 0; 
          }
          
          .footer-links a { 
            color: #64748B; 
            text-decoration: none; 
            font-weight: 500;
            transition: color 0.2s;
            font-size: 0.875rem;
          }
          
          .footer-links a:hover { 
            color: #0EA5E9; 
          }
          
          .footer-copyright { 
            font-size: 0.8rem; 
            color: #94A3B8; 
            margin-top: 16px;
            line-height: 1.5;
          }
          
          @media (max-width: 640px) {
            body { padding: 16px; }
            .email-container { border-radius: 20px; }
            .email-header { padding: 32px 24px; }
            .email-content { padding: 32px 24px; }
            .otp-code { font-size: 1.5rem; padding: 16px 24px; }
            .footer-links { flex-direction: column; gap: 12px; }
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="email-header">
            <div class="brand-logo">
              🔐 HASA GOLD STORE
            </div>
            <div class="brand-tagline">Email Verification</div>
          </div>
          
          <div class="email-content">
            <h1 class="otp-label">Your Verification Code</h1>
            <div class="otp-code">${otpCode}</div>
            
            <div class="instructions">
              <h3 class="instructions-title">📧 How to Verify Your Account</h3>
              <ul class="instructions-list">
                <li>Go to the verification page: <strong>https://hasagold.store/verify-otp</strong></li>
                <li>Enter the 6-digit code: <strong>${otpCode}</strong></li>
                <li>Click "Verify Email" to complete verification</li>
              </ul>
            </div>
            
            <div class="security-note">
              ⚠️ <strong>Security Notice:</strong> This code will expire in 15 minutes. If you didn't request this verification, please ignore this email.
            </div>
          </div>
          
          <div class="email-footer">
            <div class="footer-brand">HASA GOLD STORE</div>
            
            <div class="footer-links">
              <a href="https://hasagold.store">Website</a>
              <a href="https://hasagold.store/support">Support</a>
              <a href="https://hasagold.store/contact">Contact</a>
            </div>
            
            <div class="footer-copyright">
              © 2024 HASA GOLD STORE. All rights reserved.<br>
              Your security is our priority!
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  };
};

// Password reset email template - Beautiful HASA GOLD STORE design
const getPasswordResetEmailTemplate = (userName, resetLink) => {
  // Format customer name
  const customerName = userName && userName !== 'Customer' ? userName : 'Valued Customer';
  
  return {
    subject: '🔐 HASA GOLD STORE - Reset Your Password',
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your HASA GOLD STORE Password</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
          
          * { margin: 0; padding: 0; box-sizing: border-box; }
          
          body { 
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            background: linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%); 
            padding: 24px; 
            line-height: 1.6;
            color: #1e293b;
          }
          
          .email-container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: #ffffff; 
            border-radius: 24px; 
            overflow: hidden; 
            box-shadow: 0 20px 40px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.1);
          }
          
          .email-header { 
            background: linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%); 
            padding: 48px 32px; 
            text-align: center; 
            position: relative;
            overflow: hidden;
          }
          
          .email-header::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: linear-gradient(45deg, transparent, rgba(255,255,255,0.15), transparent);
            transform: rotate(45deg);
            animation: shimmer 4s infinite;
          }
          
          @keyframes shimmer {
            0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
            100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
          }
          
          .brand-logo { 
            font-size: 2.5rem; 
            font-weight: 900; 
            color: white; 
            margin-bottom: 8px;
            text-shadow: 0 2px 4px rgba(0,0,0,0.2);
            letter-spacing: -0.5px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
          }
          
          .brand-tagline { 
            color: rgba(255,255,255,0.95); 
            font-size: 1rem; 
            font-weight: 600;
            text-shadow: 0 1px 2px rgba(0,0,0,0.2);
            letter-spacing: 0.5px;
          }
          
          .email-content { 
            padding: 48px 40px; 
            background: #ffffff;
          }
          
          .greeting { 
            font-size: 1.75rem; 
            font-weight: 700; 
            color: #0F172A; 
            margin-bottom: 16px;
            text-align: center;
          }
          
          .main-message { 
            color: #475569; 
            font-size: 1.125rem; 
            margin-bottom: 32px;
            text-align: center;
            line-height: 1.7;
          }
          
          .reset-button-container { 
            text-align: center;
            margin: 40px 0;
          }
          
          .reset-button { 
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            width: 100%; 
            max-width: 380px; 
            padding: 16px 32px; 
            background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); 
            color: #0F172A; 
            text-decoration: none; 
            border-radius: 16px; 
            font-weight: 700; 
            font-size: 1.125rem;
            text-align: center;
            box-shadow: 0 8px 24px rgba(255,215,0,0.3);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            border: 2px solid transparent;
          }
          
          .reset-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 32px rgba(255,215,0,0.4);
            background: linear-gradient(135deg, #FFA500 0%, #FF8C00 100%);
          }
          
          .security-notice {
            background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%);
            border: 1px solid #F59E0B;
            border-radius: 16px;
            padding: 24px;
            margin: 32px 0;
            position: relative;
          }
          
          .security-notice::before {
            content: '🔒';
            position: absolute;
            top: -12px;
            left: 24px;
            background: #F59E0B;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 1rem;
          }
          
          .security-title {
            color: #92400E;
            font-weight: 700;
            margin-bottom: 12px;
            margin-top: 8px;
            font-size: 1.125rem;
          }
          
          .security-text {
            color: #78350F;
            font-size: 0.95rem;
            line-height: 1.6;
          }
          
          .security-text ul {
            list-style: none;
            padding: 0;
          }
          
          .security-text li {
            padding: 4px 0;
            position: relative;
            padding-left: 20px;
          }
          
          .security-text li::before {
            content: '•';
            position: absolute;
            left: 0;
            color: #F59E0B;
            font-weight: bold;
          }
          
          .fallback-link {
            background: #F8FAFC;
            border: 1px solid #E2E8F0;
            border-radius: 12px;
            padding: 16px;
            margin: 24px 0;
            word-break: break-all;
          }
          
          .fallback-link-label {
            font-size: 0.875rem;
            color: #64748B;
            margin-bottom: 8px;
            font-weight: 500;
          }
          
          .fallback-link a {
            color: #0EA5E9;
            text-decoration: none;
            font-weight: 500;
            transition: color 0.2s;
          }
          
          .fallback-link a:hover {
            color: #0284C7;
            text-decoration: underline;
          }
          
          .support-message {
            text-align: center;
            color: #64748B;
            font-size: 0.95rem;
            margin-top: 32px;
          }
          
          .email-footer { 
            background: #F8FAFC;
            border-top: 1px solid #E2E8F0;
            padding: 32px 40px; 
            text-align: center; 
          }
          
          .footer-brand { 
            font-size: 1.25rem; 
            font-weight: 800; 
            margin-bottom: 16px;
            background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          
          .footer-links { 
            display: flex;
            justify-content: center;
            gap: 24px;
            margin: 16px 0; 
          }
          
          .footer-links a { 
            color: #64748B; 
            text-decoration: none; 
            font-weight: 500;
            transition: color 0.2s;
            font-size: 0.875rem;
          }
          
          .footer-links a:hover { 
            color: #0EA5E9; 
          }
          
          .footer-copyright { 
            font-size: 0.8rem; 
            color: #94A3B8; 
            margin-top: 16px;
            line-height: 1.5;
          }
          
          @media (max-width: 640px) {
            body { padding: 16px; }
            .email-container { border-radius: 20px; }
            .email-header { padding: 32px 24px; }
            .email-content { padding: 32px 24px; }
            .brand-logo { font-size: 2rem; }
            .greeting { font-size: 1.5rem; }
            .main-message { font-size: 1rem; }
            .reset-button { padding: 14px 24px; font-size: 1rem; }
            .email-footer { padding: 24px; }
            .footer-links { flex-direction: column; gap: 12px; }
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="email-header">
            <div class="brand-logo">
              🎮 HASA GOLD STORE
            </div>
            <div class="brand-tagline">Secure Password Reset</div>
          </div>
          
          <div class="email-content">
            <h1 class="greeting">Hello, ${customerName}!</h1>
            
            <p class="main-message">
              We received a request to reset your password for your HASA GOLD STORE account. 
              Click the button below to securely reset your password.
            </p>
            
            <div class="reset-button-container">
              <a href="${resetLink}" class="reset-button">
                🔐 Reset My Password
              </a>
            </div>
            
            <div class="security-notice">
              <h3 class="security-title">Security Information</h3>
              <div class="security-text">
                <ul>
                  <li>This link will expire in 1 hour for security reasons</li>
                  <li>If you didn't request this password reset, please ignore this email</li>
                  <li>Your account remains secure until you click the reset link</li>
                  <li>Always ensure you're on the official HASA GOLD STORE website</li>
                </ul>
              </div>
            </div>
            
            <div class="fallback-link">
              <div class="fallback-link-label">If the button above doesn't work, copy and paste this link:</div>
              <a href="${resetLink}">${resetLink}</a>
            </div>
            
            <p class="support-message">
              If you have any questions or need assistance, our support team is here to help!
            </p>
          </div>
          
          <div class="email-footer">
            <div class="footer-brand">HASA GOLD STORE</div>
            
            <div class="footer-links">
              <a href="https://hasagold.store">Website</a>
              <a href="https://hasagold.store/support">Support</a>
              <a href="https://hasagold.store/contact">Contact</a>
            </div>
            
            <div class="footer-copyright">
              © 2024 HASA GOLD STORE. All rights reserved.<br>
              Your security is our priority!
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  };
};

// Verification email template - Attractive HASA GOLD STORE design
const getVerificationEmailTemplate = (userName, verificationLink) => {
  // Format customer name
  const customerName = userName && userName !== 'Customer' ? userName : 'Valued Customer';
  
  return {
    subject: '🎮 Welcome to HASA GOLD STORE - Verify Your Account',
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your HASA GOLD STORE Account</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;900&display=swap');
          
          * { margin: 0; padding: 0; box-sizing: border-box; }
          
          body { 
            font-family: 'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            padding: 20px; 
            line-height: 1.6;
          }
          
          .container { 
            max-width: 650px; 
            margin: 0 auto; 
            background: #ffffff; 
            border-radius: 20px; 
            overflow: hidden; 
            box-shadow: 0 25px 50px rgba(0,0,0,0.15);
          }
          
          .header { 
            background: linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%); 
            padding: 50px 30px; 
            text-align: center; 
            position: relative;
            overflow: hidden;
          }
          
          .header::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 2px, transparent 2px);
            background-size: 30px 30px;
            animation: shimmer 20s linear infinite;
          }
          
          @keyframes shimmer {
            0% { transform: translate(0, 0) rotate(0deg); }
            100% { transform: translate(-30px, -30px) rotate(360deg); }
          }
          
          .logo { 
            font-size: 42px; 
            font-weight: 900; 
            color: #000; 
            text-shadow: 3px 3px 6px rgba(0,0,0,0.1); 
            margin-bottom: 10px; 
            position: relative;
            z-index: 1;
            letter-spacing: 2px;
          }
          
          .tagline { 
            color: #000; 
            font-size: 16px; 
            font-weight: 600; 
            opacity: 0.9; 
            position: relative;
            z-index: 1;
            text-transform: uppercase;
            letter-spacing: 3px;
          }
          
          .welcome-badge {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 15px 30px;
            border-radius: 50px;
            font-weight: 700;
            font-size: 16px;
            display: inline-block;
            margin-top: 20px;
            box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
            position: relative;
            z-index: 1;
          }
          
          .content { 
            padding: 50px 40px; 
            background: #ffffff;
          }
          
          .greeting { 
            font-size: 32px; 
            font-weight: 700; 
            color: #333; 
            margin-bottom: 15px; 
            text-align: center;
          }
          
          .customer-name {
            color: #FFA500;
            font-weight: 900;
          }
          
          .message { 
            font-size: 16px; 
            color: #666; 
            margin-bottom: 30px; 
            line-height: 1.8; 
            text-align: center;
          }
          
          .button-container { 
            text-align: center; 
            margin: 40px 0; 
          }
          
          .verify-button { 
            display: inline-block; 
            background: linear-gradient(135deg, #FFD700, #FFA500); 
            color: #000; 
            padding: 20px 50px; 
            text-decoration: none; 
            border-radius: 50px; 
            font-weight: 700; 
            font-size: 18px; 
            text-transform: uppercase; 
            letter-spacing: 2px; 
            box-shadow: 0 10px 30px rgba(255,215,0,0.3); 
            transition: all 0.3s ease; 
          }
          
          .verify-button:hover { 
            transform: translateY(-3px); 
            box-shadow: 0 15px 40px rgba(255,215,0,0.4); 
          }
          
          .features-box {
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); 
            padding: 30px; 
            border-radius: 16px; 
            margin: 30px 0; 
            border-left: 5px solid #FFD700;
            box-shadow: 0 10px 30px rgba(0,0,0,0.08);
          }
          
          .features-box h3 {
            color: #333;
            font-size: 22px;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
          }
          
          .features-box ul {
            list-style: none;
            padding: 0;
          }
          
          .features-box li {
            padding: 10px 0;
            color: #666;
            font-size: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
          }
          
          .features-box li::before {
            content: '✅';
            font-size: 18px;
          }
          
          .security-notice {
            background: linear-gradient(135deg, #fff3cd, #ffeaa7);
            border: 2px solid #FFD700;
            padding: 25px;
            border-radius: 12px;
            margin: 30px 0;
          }
          
          .security-notice h4 {
            color: #856404;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          
          .security-notice p {
            color: #856404;
            font-size: 14px;
            margin: 5px 0;
          }
          
          .footer { 
            background: linear-gradient(135deg, #2c3e50, #34495e); 
            color: #ecf0f1; 
            padding: 40px; 
            text-align: center; 
          }
          
          .footer-logo { 
            font-size: 28px; 
            font-weight: 900; 
            color: #FFD700; 
            margin-bottom: 15px; 
            letter-spacing: 2px;
          }
          
          .footer-links {
            margin: 20px 0;
          }
          
          .footer-links a {
            color: #FFD700;
            text-decoration: none;
            margin: 0 15px;
            font-size: 14px;
            font-weight: 600;
          }
          
          .copyright {
            font-size: 12px;
            color: #95a5a6;
            margin-top: 20px;
          }
          
          @media (max-width: 600px) {
            .content { padding: 30px 20px; }
            .logo { font-size: 32px; }
            .greeting { font-size: 24px; }
            .verify-button { padding: 15px 30px; font-size: 16px; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🏆 HASA GOLD STORE</div>
            <div class="tagline">Premium Game Top-Up Services</div>
            <div class="welcome-badge">🎮 Welcome Aboard!</div>
          </div>
          
          <div class="content">
            <h2 class="greeting">Hi <span class="customer-name">${customerName}</span>! �</h2>
            
            <p class="message">
              Welcome to HASA GOLD STORE! We're thrilled to have you join our elite gaming community. 
              To get started and unlock all premium features, please verify your email address by clicking the button below.
            </p>
            
            <div class="button-container">
              <a href="${verificationLink}" class="verify-button">✓ Verify My Account</a>
            </div>
            
            <div class="features-box">
              <h3>🎁 What You Get After Verification:</h3>
              <ul>
                <li>Instant game top-ups with exclusive discounts</li>
                <li>Access to VIP member rewards and bonuses</li>
                <li>24/7 premium customer support</li>
                <li>Secure payment processing with buyer protection</li>
                <li>Early access to new games and special offers</li>
              </ul>
            </div>
            
            <div class="security-notice">
              <h4>🔒 Security Notice</h4>
              <p>• This verification link expires in 24 hours</p>
              <p>• Never share this link with anyone</p>
              <p>• If you didn't create this account, please ignore this email</p>
              <p>• Our team will never ask for your password</p>
            </div>
          </div>
          
          <div class="footer">
            <div class="footer-logo">HASA GOLD STORE</div>
            
            <div class="footer-links">
              <a href="https://hasagold.store">Website</a>
              <a href="https://hasagold.store/support">Support</a>
              <a href="https://hasagold.store/contact">Contact</a>
            </div>
            
            <div class="copyright">
              © 2024 HASA GOLD STORE. All rights reserved.<br>
              This email was sent to verify your account registration.
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  };
};

// Purchase confirmation template - Attractive HASA GOLD STORE design
const getPurchaseEmailTemplate = (userName, orderDetails) => {
  // Format customer name
  const customerName = userName && userName !== 'Customer' ? userName : 'Valued Customer';
  
  return {
    subject: `🎉 Purchase Confirmed - ${orderDetails.gameName} - HASA GOLD STORE`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Purchase Confirmation - HASA GOLD STORE</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;900&display=swap');
          
          * { margin: 0; padding: 0; box-sizing: border-box; }
          
          body { 
            font-family: 'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            padding: 20px; 
            line-height: 1.6;
          }
          
          .container { 
            max-width: 650px; 
            margin: 0 auto; 
            background: #ffffff; 
            border-radius: 20px; 
            overflow: hidden; 
            box-shadow: 0 25px 50px rgba(0,0,0,0.15);
          }
          
          .header { 
            background: linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%); 
            padding: 50px 30px; 
            text-align: center; 
            position: relative;
            overflow: hidden;
          }
          
          .header::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 2px, transparent 2px);
            background-size: 30px 30px;
            animation: shimmer 20s linear infinite;
          }
          
          @keyframes shimmer {
            0% { transform: translate(0, 0) rotate(0deg); }
            100% { transform: translate(-30px, -30px) rotate(360deg); }
          }
          
          .logo { 
            font-size: 42px; 
            font-weight: 900; 
            color: #000; 
            text-shadow: 3px 3px 6px rgba(0,0,0,0.1); 
            margin-bottom: 10px; 
            position: relative;
            z-index: 1;
            letter-spacing: 2px;
          }
          
          .tagline { 
            color: #000; 
            font-size: 16px; 
            font-weight: 600; 
            opacity: 0.9; 
            position: relative;
            z-index: 1;
            text-transform: uppercase;
            letter-spacing: 3px;
          }
          
          .success-badge {
            background: linear-gradient(135deg, #28a745, #20c997);
            color: white;
            padding: 15px 30px;
            border-radius: 50px;
            font-weight: 700;
            font-size: 18px;
            display: inline-block;
            margin-top: 20px;
            box-shadow: 0 10px 30px rgba(40, 167, 69, 0.3);
            position: relative;
            z-index: 1;
          }
          
          .content { 
            padding: 50px 40px; 
            background: #ffffff;
          }
          
          .greeting { 
            font-size: 32px; 
            font-weight: 700; 
            color: #333; 
            margin-bottom: 15px; 
            text-align: center;
          }
          
          .customer-name {
            color: #FFA500;
            font-weight: 900;
          }
          
          .message { 
            font-size: 16px; 
            color: #666; 
            margin-bottom: 30px; 
            line-height: 1.8; 
            text-align: center;
          }
          
          .order-card { 
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); 
            padding: 30px; 
            border-radius: 16px; 
            margin: 30px 0; 
            border-left: 5px solid #FFD700;
            box-shadow: 0 10px 30px rgba(0,0,0,0.08);
          }
          
          .order-card h3 {
            color: #333;
            font-size: 22px;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
          }
          
          .order-row {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px dashed #dee2e6;
          }
          
          .order-row:last-child {
            border-bottom: none;
          }
          
          .order-label {
            font-weight: 600;
            color: #495057;
          }
          
          .order-value {
            font-weight: 700;
            color: #333;
          }
          
          .amount-value {
            color: #28a745;
            font-size: 20px;
          }
          
          .status-badge {
            background: linear-gradient(135deg, #FFD700, #FFA500);
            color: #000;
            padding: 5px 15px;
            border-radius: 20px;
            font-weight: 700;
            font-size: 12px;
            text-transform: uppercase;
          }
          
          .info-box {
            background: linear-gradient(135deg, #fff3cd, #ffeaa7);
            border: 2px solid #FFD700;
            padding: 25px;
            border-radius: 12px;
            margin: 30px 0;
          }
          
          .info-box h4 {
            color: #856404;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          
          .info-box p {
            color: #856404;
            font-size: 14px;
            margin: 5px 0;
          }
          
          .footer { 
            background: linear-gradient(135deg, #2c3e50, #34495e); 
            color: #ecf0f1; 
            padding: 40px; 
            text-align: center; 
          }
          
          .footer-logo { 
            font-size: 28px; 
            font-weight: 900; 
            color: #FFD700; 
            margin-bottom: 15px; 
            letter-spacing: 2px;
          }
          
          .footer-links {
            margin: 20px 0;
          }
          
          .footer-links a {
            color: #FFD700;
            text-decoration: none;
            margin: 0 15px;
            font-size: 14px;
            font-weight: 600;
          }
          
          .copyright {
            font-size: 12px;
            color: #95a5a6;
            margin-top: 20px;
          }
          
          @media (max-width: 600px) {
            .content { padding: 30px 20px; }
            .logo { font-size: 32px; }
            .greeting { font-size: 24px; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🏆 HASA GOLD STORE</div>
            <div class="tagline">Premium Game Top-Up Services</div>
            <div class="success-badge">✓ Purchase Confirmed</div>
          </div>
          
          <div class="content">
            <h2 class="greeting">Thank You, <span class="customer-name">${customerName}</span>! 🎮</h2>
            
            <p class="message">
              Your purchase has been successfully processed and confirmed. We're preparing your game credits for immediate delivery!
            </p>
            
            <div class="order-card">
              <h3>📋 Order Summary</h3>
              
              <div class="order-row">
                <span class="order-label">Order ID:</span>
                <span class="order-value">${orderDetails.orderId}</span>
              </div>
              
              <div class="order-row">
                <span class="order-label">Game:</span>
                <span class="order-value">${orderDetails.gameName}</span>
              </div>
              
              <div class="order-row">
                <span class="order-label">Amount Paid:</span>
                <span class="order-value amount-value">LKR ${orderDetails.amount.toLocaleString()}</span>
              </div>
              
              <div class="order-row">
                <span class="order-label">Status:</span>
                <span class="status-badge">${orderDetails.status}</span>
              </div>
              
              <div class="order-row">
                <span class="order-label">Purchase Date:</span>
                <span class="order-value">${new Date().toLocaleDateString()}</span>
              </div>
            </div>
            
            <div class="info-box">
              <h4>⏱️ What's Next?</h4>
              <p>• Your game credits will be delivered within 5-10 minutes</p>
              <p>• You'll receive a notification once delivery is complete</p>
              <p>• Keep this email as your purchase receipt</p>
            </div>
            
            <p class="message">
              If you have any questions or concerns, our 24/7 support team is ready to help you!
            </p>
          </div>
          
          <div class="footer">
            <div class="footer-logo">HASA GOLD STORE</div>
            
            <div class="footer-links">
              <a href="https://hasagold.store">Website</a>
              <a href="https://hasagold.store/support">Support</a>
              <a href="https://hasagold.store/contact">Contact</a>
            </div>
            
            <div class="copyright">
              © 2024 HASA GOLD STORE. All rights reserved.<br>
              Thank you for your business!
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  };
};

// Order approval template
const getOrderApprovedTemplate = (userName, orderDetails) => {
  const customerName = userName && userName !== 'Customer' ? userName : 'Valued Customer';
  
  return {
    subject: `✅ Order Approved - ${orderDetails.gameName} - HASA GOLD STORE`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Approved - HASA GOLD STORE</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%); padding: 24px; line-height: 1.6; }
          .email-container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
          .email-header { background: linear-gradient(135deg, #10B981 0%, #059669 50%, #047857 100%); padding: 48px 32px; text-align: center; }
          .brand-logo { font-size: 2rem; font-weight: 900; color: white; margin-bottom: 8px; }
          .email-content { padding: 48px 40px; }
          .success-icon { width: 80px; height: 80px; background: #10B981; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; }
          .success-icon svg { width: 40px; height: 40px; color: white; }
          .order-details { background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 16px; padding: 24px; margin: 24px 0; }
          .order-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #E2E8F0; }
          .order-row:last-child { border-bottom: none; }
          .order-label { color: #64748B; font-size: 0.875rem; }
          .order-value { font-weight: 600; color: #1E293B; }
          .footer { background: #F8FAFC; border-top: 1px solid #E2E8F0; padding: 32px 40px; text-align: center; }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="email-header">
            <div class="brand-logo">🎮 HASA GOLD STORE</div>
            <div style="color: white; font-weight: 600;">Order Approved</div>
          </div>
          <div class="email-content">
            <div class="success-icon">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 style="text-align: center; font-size: 1.75rem; font-weight: 700; color: #1E293B; margin-bottom: 16px;">
              Great news, ${customerName}!
            </h1>
            <p style="text-align: center; color: #475569; margin-bottom: 24px;">
              Your order has been approved and is being processed. Your game top-up will be delivered shortly.
            </p>
            <div class="order-details">
              <div class="order-row">
                <span class="order-label">Order ID</span>
                <span class="order-value">#${orderDetails.orderId || 'N/A'}</span>
              </div>
              <div class="order-row">
                <span class="order-label">Game</span>
                <span class="order-value">${orderDetails.gameName}</span>
              </div>
              <div class="order-row">
                <span class="order-label">Package</span>
                <span class="order-value">${orderDetails.packageName}</span>
              </div>
              <div class="order-row">
                <span class="order-label">Player ID</span>
                <span class="order-value">${orderDetails.playerId}</span>
              </div>
              <div class="order-row">
                <span class="order-label">Amount</span>
                <span class="order-value">LKR ${orderDetails.amount?.toLocaleString()}</span>
              </div>
            </div>
            <p style="text-align: center; color: #64748B; font-size: 0.875rem;">
              If you have any questions, feel free to contact our support team.
            </p>
          </div>
          <div class="footer">
            <div style="font-weight: 800; margin-bottom: 8px;">HASA GOLD STORE</div>
            <div style="color: #94A3B8; font-size: 0.8rem;">© 2024 HASA GOLD STORE. All rights reserved.</div>
          </div>
        </div>
      </body>
      </html>
    `
  };
};

// Order rejection template
const getOrderRejectedTemplate = (userName, orderDetails) => {
  const customerName = userName && userName !== 'Customer' ? userName : 'Valued Customer';
  
  return {
    subject: `❌ Order Rejected - ${orderDetails.gameName} - HASA GOLD STORE`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Rejected - HASA GOLD STORE</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%); padding: 24px; line-height: 1.6; }
          .email-container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
          .email-header { background: linear-gradient(135deg, #DC2626 0%, #B91C1C 50%, #991B1B 100%); padding: 48px 32px; text-align: center; }
          .brand-logo { font-size: 2rem; font-weight: 900; color: white; margin-bottom: 8px; }
          .email-content { padding: 48px 40px; }
          .error-icon { width: 80px; height: 80px; background: #DC2626; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; }
          .error-icon svg { width: 40px; height: 40px; color: white; }
          .order-details { background: #FEF2F2; border: 1px solid #FCA5A5; border-radius: 16px; padding: 24px; margin: 24px 0; }
          .order-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #FCA5A5; }
          .order-row:last-child { border-bottom: none; }
          .order-label { color: #7C2D12; font-size: 0.875rem; }
          .order-value { font-weight: 600; color: #1E293B; }
          .support-box { background: #FFFBEB; border: 1px solid #FCD34D; border-radius: 12px; padding: 20px; margin: 24px 0; }
          .footer { background: #F8FAFC; border-top: 1px solid #E2E8F0; padding: 32px 40px; text-align: center; }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="email-header">
            <div class="brand-logo">🎮 HASA GOLD STORE</div>
            <div style="color: white; font-weight: 600;">Order Rejected</div>
          </div>
          <div class="email-content">
            <div class="error-icon">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 style="text-align: center; font-size: 1.75rem; font-weight: 700; color: #1E293B; margin-bottom: 16px;">
              We're sorry, ${customerName}
            </h1>
            <p style="text-align: center; color: #475569; margin-bottom: 24px;">
              Your order could not be processed. Please review the details below and contact our support team for assistance.
            </p>
            <div class="order-details">
              <div class="order-row">
                <span class="order-label">Order ID</span>
                <span class="order-value">#${orderDetails.orderId || 'N/A'}</span>
              </div>
              <div class="order-row">
                <span class="order-label">Game</span>
                <span class="order-value">${orderDetails.gameName}</span>
              </div>
              <div class="order-row">
                <span class="order-label">Package</span>
                <span class="order-value">${orderDetails.packageName}</span>
              </div>
              <div class="order-row">
                <span class="order-label">Amount</span>
                <span class="order-value">LKR ${orderDetails.amount?.toLocaleString()}</span>
              </div>
            </div>
            <div class="support-box">
              <div style="font-weight: 700; color: #92400E; margin-bottom: 8px;">Need Help?</div>
              <div style="color: #78350F; font-size: 0.875rem;">
                If you believe this is an error, please contact our support team with your order ID.
              </div>
            </div>
          </div>
          <div class="footer">
            <div style="font-weight: 800; margin-bottom: 8px;">HASA GOLD STORE</div>
            <div style="color: #94A3B8; font-size: 0.8rem;">© 2024 HASA GOLD STORE. All rights reserved.</div>
          </div>
        </div>
      </body>
      </html>
    `
  };
};

// Main handler
module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { type, to, userName, verificationLink, orderDetails, otpCode } = req.body;

    if (!to) {
      return res.status(400).json({ error: 'Email address is required' });
    }

    // Check environment variables - Use Gmail SMTP for better serverless compatibility
    const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
    const smtpPort = parseInt(process.env.SMTP_PORT) || 587;
    const smtpUser = process.env.SMTP_USER || 'hasagoldstore@gmail.com';
    const smtpPass = process.env.SMTP_PASS || 'your-app-password';

    console.log('🔧 SMTP Config:', { smtpHost, smtpPort, smtpUser });

    // Create transporter with error handling
    let transporter;
    try {
      transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: false,
        auth: {
          user: smtpUser,
          pass: smtpPass
        },
        tls: {
          rejectUnauthorized: false
        }
      });
    } catch (configError) {
      console.error('❌ Transporter config error:', configError.message);
      return res.status(500).json({ error: 'SMTP configuration error: ' + configError.message });
    }

    let emailTemplate;
    
    if (type === 'verification' && verificationLink) {
      emailTemplate = getVerificationEmailTemplate(userName || 'Gamer', verificationLink);
    } else if (type === 'otp' && otpCode) {
      emailTemplate = getOTPEmailTemplate(userName || 'Valued Customer', otpCode, to);
    } else if (type === 'password-reset' && verificationLink) {
      emailTemplate = getPasswordResetEmailTemplate(userName || 'Valued Customer', verificationLink);
    } else if (type === 'purchase' && orderDetails) {
      emailTemplate = getPurchaseEmailTemplate(userName || 'Customer', orderDetails);
    } else if (type === 'order-approved' && orderDetails) {
      emailTemplate = getOrderApprovedTemplate(userName || 'Valued Customer', orderDetails);
    } else if (type === 'order-rejected' && orderDetails) {
      emailTemplate = getOrderRejectedTemplate(userName || 'Valued Customer', orderDetails);
    } else {
      return res.status(400).json({ error: 'Invalid email type or missing parameters' });
    }

    const mailOptions = {
      from: `"HASA GOLD STORE" <${smtpUser}>`,
      to: to,
      subject: emailTemplate.subject,
      html: emailTemplate.html
    };

    console.log('📧 About to send email with options:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject
    });

    const result = await transporter.sendMail(mailOptions);
    
    console.log(`✅ Email sent to: ${to}`);
    console.log(`📬 Message ID: ${result.messageId}`);
    
    res.json({ 
      success: true, 
      message: 'Email sent successfully!',
      messageId: result.messageId
    });
    
  } catch (error) {
    console.error('❌ Email sending error:', error.message);
    console.error('❌ Full error:', error);
    console.error('❌ Error stack:', error.stack);
    console.error('❌ Request body:', req.body);
    res.status(500).json({ 
      error: 'Failed to send email: ' + error.message,
      details: error.toString(),
      stack: error.stack
    });
  }
}
