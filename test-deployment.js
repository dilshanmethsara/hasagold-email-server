// Test script to verify the email server deployment
const testEmailServer = async () => {
  try {
    console.log('🧪 Testing email server deployment...');
    
    const response = await fetch('https://hasagold-email-server.vercel.app/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'verification',
        to: 'test@example.com',
        userName: 'Test User',
        verificationLink: 'https://hasagold.store/test'
      })
    });

    const result = await response.text();
    console.log('📬 Response status:', response.status);
    console.log('📄 Response body:', result);
    
    if (response.ok) {
      console.log('✅ Email server is working correctly!');
    } else {
      console.log('❌ Email server has issues');
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
};

// Run test
testEmailServer();
