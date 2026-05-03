# Website Purchase Email Integration

## Overview
Integrate custom purchase confirmation emails into your HASA GOLD STORE website's payment flow.

## Purchase Flow Integration

### 1. Payment Success Handler
```javascript
// Add this to your payment success callback
async function handlePaymentSuccess(paymentData) {
  try {
    // 1. Your existing payment processing
    const orderData = await processPayment(paymentData);
    
    // 2. Send purchase confirmation email
    const emailSent = await sendPurchaseConfirmationEmail(orderData);
    
    if (emailSent) {
      console.log('✅ Purchase confirmation email sent');
      // Show success message to user
      showSuccessMessage('Purchase successful! Check your email for confirmation.');
    } else {
      console.error('❌ Failed to send purchase email');
      // Still show success but note email issue
      showSuccessMessage('Purchase successful! (Email confirmation may be delayed)');
    }
    
    // 3. Redirect to success page
    window.location.href = '/purchase-success?orderId=' + orderData.orderId;
    
  } catch (error) {
    console.error('Payment processing error:', error);
    showErrorMessage('Payment processing failed. Please contact support.');
  }
}

// Email sending function
async function sendPurchaseConfirmationEmail(orderData) {
  try {
    const response = await fetch('https://hasagold-email-server.vercel.app/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'purchase',
        to: orderData.customerEmail,
        userName: orderData.customerName,
        orderDetails: {
          orderId: orderData.orderId,
          gameName: orderData.gameName,
          amount: orderData.amount,
          currency: orderData.currency,
          status: 'completed',
          items: orderData.items
        }
      })
    });
    
    const result = await response.json();
    return result.success;
    
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
}
```

### 2. Example with Stripe Integration
```javascript
// Stripe payment success handler
const stripe = Stripe('your-publishable-key');

// When user completes payment
stripe.confirmCardPayment(clientSecret, {
  payment_method: {
    card: cardElement,
    billing_details: {
      name: customerName,
      email: customerEmail
    }
  }
}).then(async function(result) {
  if (result.error) {
    showErrorMessage(result.error.message);
  } else {
    // Payment successful
    const paymentIntent = result.paymentIntent;
    
    // Prepare order data
    const orderData = {
      orderId: 'HASA-' + Date.now(),
      customerEmail: customerEmail,
      customerName: customerName,
      gameName: selectedGame.name,
      amount: selectedGame.price,
      currency: 'USD',
      items: [{
        name: selectedGame.itemName,
        quantity: 1,
        price: selectedGame.price
      }],
      paymentId: paymentIntent.id
    };
    
    // Send confirmation email
    await sendPurchaseConfirmationEmail(orderData);
    
    // Save order to database
    await saveOrderToDatabase(orderData);
    
    // Show success
    showPurchaseSuccess(orderData);
  }
});
```

### 3. Example with PayPal Integration
```javascript
// PayPal payment completion
paypal.Buttons({
  createOrder: function(data, actions) {
    return actions.order.create({
      purchase_units: [{
        amount: {
          value: selectedGame.price
        }
      }]
    });
  },
  onApprove: async function(data, actions) {
    const order = await actions.order.capture();
    
    // Prepare order data
    const orderData = {
      orderId: 'HASA-' + Date.now(),
      customerEmail: customerEmail,
      customerName: customerName,
      gameName: selectedGame.name,
      amount: order.purchase_units[0].amount.value,
      currency: order.purchase_units[0].amount.currency_code,
      items: [{
        name: selectedGame.itemName,
        quantity: 1,
        price: order.purchase_units[0].amount.value
      }],
      paymentId: order.id
    };
    
    // Send confirmation email
    await sendPurchaseConfirmationEmail(orderData);
    
    // Save order and show success
    await saveOrderToDatabase(orderData);
    showPurchaseSuccess(orderData);
  }
}).render('#paypal-button-container');
```

### 4. Complete Purchase Page Example
```javascript
// Complete purchase page with email integration
class PurchasePage {
  constructor() {
    this.selectedGame = null;
    this.customerInfo = {};
    this.init();
  }
  
  init() {
    this.setupEventListeners();
    this.loadGames();
  }
  
  setupEventListeners() {
    document.getElementById('purchase-btn').addEventListener('click', () => {
      this.processPurchase();
    });
  }
  
  async processPurchase() {
    try {
      // Get customer info
      this.customerInfo = {
        email: document.getElementById('customer-email').value,
        name: document.getElementById('customer-name').value
      };
      
      // Validate
      if (!this.customerInfo.email || !this.customerInfo.name) {
        alert('Please fill in all fields');
        return;
      }
      
      // Process payment (your existing payment logic)
      const paymentResult = await this.processPayment();
      
      if (paymentResult.success) {
        // Send purchase confirmation email
        const orderData = {
          orderId: 'HASA-' + Date.now(),
          customerEmail: this.customerInfo.email,
          customerName: this.customerInfo.name,
          gameName: this.selectedGame.name,
          amount: this.selectedGame.price,
          currency: 'USD',
          status: 'completed',
          items: [{
            name: this.selectedGame.itemName,
            quantity: 1,
            price: this.selectedGame.price
          }],
          paymentId: paymentResult.paymentId
        };
        
        const emailSent = await this.sendPurchaseEmail(orderData);
        
        if (emailSent) {
          this.showSuccess('Purchase successful! Check your email for confirmation.');
        } else {
          this.showSuccess('Purchase successful! (Email confirmation may be delayed)');
        }
        
        // Save order
        await this.saveOrder(orderData);
        
        // Redirect after 3 seconds
        setTimeout(() => {
          window.location.href = '/account';
        }, 3000);
      }
      
    } catch (error) {
      console.error('Purchase error:', error);
      this.showError('Purchase failed. Please try again.');
    }
  }
  
  async sendPurchaseEmail(orderData) {
    try {
      const response = await fetch('https://hasagold-email-server.vercel.app/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'purchase',
          to: orderData.customerEmail,
          userName: orderData.customerName,
          orderDetails: {
            orderId: orderData.orderId,
            gameName: orderData.gameName,
            amount: orderData.amount,
            currency: orderData.currency,
            status: orderData.status,
            items: orderData.items
          }
        })
      });
      
      const result = await response.json();
      return result.success;
      
    } catch (error) {
      console.error('Email sending failed:', error);
      return false;
    }
  }
  
  async processPayment() {
    // Your existing payment processing logic
    // Return { success: true, paymentId: 'xxx' } or { success: false }
  }
  
  async saveOrder(orderData) {
    // Save order to your database/Firestore
  }
  
  showSuccess(message) {
    // Show success message to user
    document.getElementById('success-message').textContent = message;
    document.getElementById('success-modal').style.display = 'block';
  }
  
  showError(message) {
    // Show error message to user
    alert(message);
  }
}

// Initialize purchase page
new PurchasePage();
```

### 5. Test Purchase from Website
```html
<!-- Add test button to your website for testing -->
<button onclick="testPurchaseEmail()" style="background: #FFD700; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">
  Test Purchase Email
</button>

<script>
function testPurchaseEmail() {
  const testData = {
    customerEmail: 'dmcreatorstudio04@gmail.com',
    customerName: 'Test User',
    gameName: 'PUBG Mobile UC',
    amount: 25.00,
    orderId: 'TEST-' + Date.now()
  };
  
  fetch('https://hasagold-email-server.vercel.app/api/send-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'purchase',
      to: testData.customerEmail,
      userName: testData.customerName,
      orderDetails: {
        orderId: testData.orderId,
        gameName: testData.gameName,
        amount: testData.amount,
        currency: 'USD',
        status: 'completed',
        items: [{ name: '600 UC', quantity: 1, price: testData.amount }]
      }
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      alert('✅ Test purchase email sent! Check dmcreatorstudio04@gmail.com');
    } else {
      alert('❌ Failed to send test email: ' + data.error);
    }
  })
  .catch(error => {
    alert('❌ Error: ' + error.message);
  });
}
</script>
```

## Integration Steps

### Step 1: Add Email Function to Your Website
Copy the `sendPurchaseConfirmationEmail` function to your website's JavaScript.

### Step 2: Call Email Function on Payment Success
Add the email sending call to your existing payment success handlers.

### Step 3: Test with Real Purchase
Complete a real purchase on your website to test the email flow.

### Step 4: Monitor Email Delivery
Check that customers receive purchase confirmations instantly.

## Benefits

✅ **Instant Delivery** - Emails sent immediately after payment
✅ **Professional Branding** - HASA GOLD STORE themed emails
✅ **Order Details** - Complete purchase information included
✅ **Customer Trust** - Professional confirmation builds confidence
✅ **Record Keeping** - Customers have email proof of purchase

Now your website will automatically send beautiful purchase confirmation emails to customers!
