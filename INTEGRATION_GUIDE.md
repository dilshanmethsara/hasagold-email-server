# HASA GOLD STORE Email Integration Guide

## Overview
Your custom email server is now live at: `https://hasagold-email-server.vercel.app/api/send-email`

## User Verification Emails

### When to Send
- New user registration
- Email change requests
- Password reset requests

### Integration Code

```javascript
// Send verification email
async function sendVerificationEmail(userEmail, userName, verificationLink) {
  try {
    const response = await fetch('https://hasagold-email-server.vercel.app/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'verification',
        to: userEmail,
        userName: userName,
        verificationLink: verificationLink
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Verification email sent to:', userEmail);
      return true;
    } else {
      console.error('❌ Failed to send verification email:', result.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Error sending verification email:', error);
    return false;
  }
}

// Usage Examples:

// 1. New User Registration
const newUser = {
  email: 'user@example.com',
  name: 'John Doe',
  uid: 'user123456'
};

const verificationLink = `https://hasagold.store/verify-email?token=abc123&uid=${newUser.uid}`;
await sendVerificationEmail(newUser.email, newUser.name, verificationLink);

// 2. Email Change Request
const emailChangeLink = `https://hasagold.store/confirm-email-change?token=xyz789&uid=user123456`;
await sendVerificationEmail('newemail@example.com', 'John Doe', emailChangeLink);
```

## Purchase Confirmation Emails

### When to Send
- Successful payment completion
- Order status updates
- Digital goods delivery

### Integration Code

```javascript
// Send purchase confirmation email
async function sendPurchaseEmail(userEmail, userName, orderDetails) {
  try {
    const response = await fetch('https://hasagold-email-server.vercel.app/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'purchase',
        to: userEmail,
        userName: userName,
        orderDetails: orderDetails
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Purchase email sent to:', userEmail);
      return true;
    } else {
      console.error('❌ Failed to send purchase email:', result.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Error sending purchase email:', error);
    return false;
  }
}

// Usage Examples:

// 1. Game Top-up Purchase
const gamePurchase = {
  orderId: 'HASA-2024-12345',
  gameName: 'PUBG Mobile UC',
  amount: 25.00,
  currency: 'USD',
  status: 'completed',
  userId: 'player123',
  items: [
    { name: '600 UC', quantity: 1, price: 25.00 }
  ]
};

await sendPurchaseEmail('player@example.com', 'Gamer123', gamePurchase);

// 2. Multiple Game Items
const multiPurchase = {
  orderId: 'HASA-2024-67890',
  gameName: 'Free Fire Diamonds',
  amount: 50.00,
  currency: 'USD',
  status: 'completed',
  userId: 'player456',
  items: [
    { name: '1000 Diamonds', quantity: 1, price: 50.00 }
  ]
};

await sendPurchaseEmail('player2@example.com', 'ProGamer', multiPurchase);
```

## Firebase Integration

### Cloud Function Example

```javascript
// Firebase Cloud Function to send verification email
exports.sendUserVerification = functions.auth.user().onCreate(async (user) => {
  const email = user.email;
  const displayName = user.displayName || 'User';
  
  // Generate verification token (you'll need to implement this)
  const verificationToken = generateVerificationToken(user.uid);
  const verificationLink = `https://hasagold.store/verify-email?token=${verificationToken}&uid=${user.uid}`;
  
  try {
    const response = await fetch('https://hasagold-email-server.vercel.app/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'verification',
        to: email,
        userName: displayName,
        verificationLink: verificationLink
      })
    });
    
    const result = await response.json();
    console.log('Verification email sent:', result);
    
  } catch (error) {
    console.error('Error sending verification email:', error);
  }
});
```

## Frontend Integration

### React Component Example

```javascript
import React, { useState } from 'react';

const EmailService = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const sendVerificationEmail = async (userEmail, userName) => {
    setLoading(true);
    setMessage('');
    
    try {
      const response = await fetch('https://hasagold-email-server.vercel.app/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'verification',
          to: userEmail,
          userName: userName,
          verificationLink: `https://hasagold.store/verify-email?token=demo123&uid=user123`
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setMessage('✅ Verification email sent successfully!');
      } else {
        setMessage(`❌ Failed: ${result.error}`);
      }
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button 
        onClick={() => sendVerificationEmail('dmcreatorstudio04@gmail.com', 'Test User')}
        disabled={loading}
      >
        {loading ? 'Sending...' : 'Send Verification Email'}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};
```

## Error Handling

### Common Error Codes
- `405`: Method not allowed (use POST)
- `400`: Missing required fields
- `500`: SMTP configuration error

### Best Practices
1. Always check `result.success` before proceeding
2. Implement retry logic for failed emails
3. Log email sending attempts for debugging
4. Handle network timeouts gracefully

## Security Notes

1. **Never expose SMTP credentials in frontend code**
2. **Use environment variables for sensitive data**
3. **Validate email addresses before sending**
4. **Rate limit email sending to prevent abuse**
5. **Implement proper authentication for your API endpoints**

## Testing

Use the debug endpoint to test your configuration:
```javascript
fetch('https://hasagold-email-server.vercel.app/api/debug')
  .then(response => response.json())
  .then(data => console.log(data));
```

## Production Checklist

- [ ] Set up Gmail App Password
- [ ] Configure environment variables in Vercel
- [ ] Test with real email addresses
- [ ] Implement error handling in your app
- [ ] Set up email sending logs
- [ ] Test email delivery to different providers
