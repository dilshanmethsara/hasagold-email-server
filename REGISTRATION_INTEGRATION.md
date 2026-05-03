# User Registration Email Integration

## Overview
Replace Firebase's default emails with your custom HASA GOLD STORE branded emails during user registration.

## Registration Flow with Custom Emails

### 1. Frontend Registration Form
```javascript
// React Component Example
import React, { useState } from 'react';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleRegistration = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // 1. Create user in Firebase Auth
      const userCredential = await firebase.auth().createUserWithEmailAndPassword(
        formData.email, 
        formData.password
      );
      
      const user = userCredential.user;
      
      // 2. Update user profile
      await user.updateProfile({
        displayName: formData.displayName
      });

      // 3. Send custom verification email
      const verificationLink = `https://hasagold.store/verify-email?token=${generateToken(user.uid)}&uid=${user.uid}`;
      
      const emailSent = await sendCustomVerificationEmail(
        formData.email, 
        formData.displayName, 
        verificationLink
      );

      if (emailSent) {
        setMessage('✅ Registration successful! Check your email for verification.');
        
        // 4. Save user data to Firestore
        await firebase.firestore().collection('users').doc(user.uid).set({
          email: formData.email,
          displayName: formData.displayName,
          phone: formData.phone,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          emailVerified: false,
          verificationToken: generateToken(user.uid)
        });
      } else {
        setMessage('❌ Registration succeeded but email failed. Please contact support.');
      }

    } catch (error) {
      setMessage(`❌ Registration failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegistration}>
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
        required
      />
      <input
        type="text"
        placeholder="Display Name"
        value={formData.displayName}
        onChange={(e) => setFormData({...formData, displayName: e.target.value})}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(e) => setFormData({...formData, password: e.target.value})}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Registering...' : 'Register'}
      </button>
      {message && <p>{message}</p>}
    </form>
  );
};

// Helper function to generate verification token
function generateToken(uid) {
  return btoa(`${uid}-${Date.now()}-${Math.random().toString(36).substring(2)}`);
}

// Custom email sending function
async function sendCustomVerificationEmail(email, displayName, verificationLink) {
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
    return result.success;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
}
```

### 2. Firebase Cloud Function (Alternative)
```javascript
// functions/index.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.sendCustomVerificationEmail = functions.auth.user().onCreate(async (user) => {
  // Only send if email is not already verified
  if (user.emailVerified) {
    console.log('Email already verified for user:', user.email);
    return null;
  }

  const displayName = user.displayName || 'Gamer';
  const verificationToken = generateVerificationToken(user.uid);
  const verificationLink = `https://hasagold.store/verify-email?token=${verificationToken}&uid=${user.uid}`;

  try {
    // Save verification token to Firestore
    await admin.firestore().collection('users').doc(user.uid).set({
      email: user.email,
      displayName: displayName,
      emailVerified: false,
      verificationToken: verificationToken,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Send custom email
    const response = await fetch('https://hasagold-email-server.vercel.app/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'verification',
        to: user.email,
        userName: displayName,
        verificationLink: verificationLink
      })
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Custom verification email sent to:', user.email);
    } else {
      console.error('❌ Failed to send custom verification email:', result.error);
    }

  } catch (error) {
    console.error('❌ Error in sendCustomVerificationEmail:', error);
  }
});

function generateVerificationToken(uid) {
  return Buffer.from(`${uid}-${Date.now()}-${Math.random()}`).toString('base64');
}
```

### 3. Email Verification Endpoint
```javascript
// Backend endpoint to handle email verification
app.get('/verify-email', async (req, res) => {
  const { token, uid } = req.query;

  try {
    // Get user data from Firestore
    const userDoc = await firebase.firestore().collection('users').doc(uid).get();
    
    if (!userDoc.exists) {
      return res.status(404).send('User not found');
    }

    const userData = userDoc.data();

    // Verify token
    if (userData.verificationToken !== token) {
      return res.status(400).send('Invalid verification token');
    }

    // Mark email as verified in Firebase Auth
    await admin.auth().updateUser(uid, {
      emailVerified: true
    });

    // Update Firestore
    await firebase.firestore().collection('users').doc(uid).update({
      emailVerified: true,
      verificationToken: null,
      emailVerifiedAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    // Redirect to success page
    res.redirect('https://hasagold.store/verification-success');

  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).send('Verification failed. Please try again.');
  }
});
```

## Integration Steps

### Step 1: Update Your Registration Form
Replace Firebase's default email sending with your custom function:

```javascript
// BEFORE (Firebase default)
await user.sendEmailVerification();

// AFTER (Custom email)
const verificationLink = `https://hasagold.store/verify-email?token=${token}&uid=${user.uid}`;
await sendCustomVerificationEmail(user.email, displayName, verificationLink);
```

### Step 2: Disable Firebase Default Emails
In your Firebase project settings:
1. Go to Authentication → Templates
2. Disable or customize the default email verification template
3. This prevents users from receiving both Firebase and custom emails

### Step 3: Set Up Verification Page
Create a verification page at `https://hasagold.store/verify-email` that handles the token verification.

## Benefits of Custom Emails

✅ **HASA GOLD STORE Branding** - Professional gold-themed design
✅ **Custom Domain** - Sent from hasagoldstore@gmail.com
✅ **Better Control** - Full control over email content and timing
✅ **Analytics** - Track email delivery and opens
✅ **No Firebase Limits** - Bypass Firebase email restrictions

## Testing Your Integration

```javascript
// Test the complete flow
async function testRegistrationFlow() {
  const testData = {
    email: 'dmcreatorstudio04@gmail.com',
    password: 'TestPassword123!',
    displayName: 'Test User'
  };

  try {
    // 1. Register user
    const result = await registerUser(testData);
    console.log('Registration result:', result);
    
    // 2. Check if email was sent
    console.log('Check your email for the verification link!');
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}
```

## Error Handling

```javascript
// Robust error handling for email sending
async function sendVerificationEmailWithRetry(email, displayName, verificationLink, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
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
      
      if (result.success) {
        console.log(`✅ Email sent on attempt ${attempt}`);
        return true;
      } else {
        throw new Error(result.error);
      }
      
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error.message);
      
      if (attempt === maxRetries) {
        // Log to monitoring service
        await logEmailFailure(email, error.message);
        return false;
      }
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
}
```

Now your users will receive beautiful, branded HASA GOLD STORE verification emails instead of Firebase's generic ones!
