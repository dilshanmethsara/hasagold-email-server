# HASA GOLD STORE Email Server

Free 24/7 email server for HASA GOLD STORE using Vercel serverless functions.

## Features
- ✅ Email verification
- ✅ Purchase confirmation
- ✅ Professional templates
- ✅ Custom domain: no-reply@hasagold.store
- ✅ Free hosting on Vercel

## Environment Variables
Set these in Vercel project settings:
```
SMTP_HOST = mail.privateemail.com
SMTP_PORT = 587
SMTP_USER = no-reply@hasagold.store
SMTP_PASS = @hasa1234G
```

## API Endpoints
- POST `/api/send-email`

## Usage
```javascript
// Send verification email
fetch('https://hasagold-email-server.vercel.app/api/send-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: 'verification',
    to: 'user@example.com',
    userName: 'John',
    verificationLink: 'https://hasagold.store/auth?verified=true'
  })
})

// Send purchase confirmation
fetch('https://hasagold-email-server.vercel.app/api/send-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: 'purchase',
    to: 'user@example.com',
    userName: 'John',
    orderDetails: {
      orderId: '12345',
      gameName: 'PUBG Mobile',
      amount: 10,
      currency: 'USD',
      status: 'pending'
    }
  })
})
```
