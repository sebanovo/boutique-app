// components/stripe/PaymentForm.jsx
import React, { useState, useEffect } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

const PaymentForm = ({ amount = 1000 }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    createPaymentIntent(amount);
  }, [amount]);

  const createPaymentIntent = async (amount) => {
    try {
      console.log('🔄 Creating payment intent for amount:', amount);
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/venta/create-payment/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
      });

      const data = await response.json();
      console.log('📦 Payment intent response:', data);
      
      if (response.ok && data.clientSecret) {
        setClientSecret(data.clientSecret);
        console.log('✅ Client secret received');
      } else {
        setError(data.error || 'Error creating payment');
        console.error('❌ Error from backend:', data.error);
      }
    } catch (err) {
      setError('Network error: ' + err.message);
      console.error('❌ Network error:', err);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    if (!stripe || !elements) {
      setError('Stripe not loaded yet');
      setLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);

    try {
      console.log('🔐 Confirming payment...');
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (stripeError) {
        setError(stripeError.message);
        console.error('❌ Stripe error:', stripeError);
      } else if (paymentIntent.status === 'succeeded') {
        setSuccess(true);
        console.log('✅ Payment succeeded!', paymentIntent);
      }
    } catch (err) {
      setError('Payment failed: ' + err.message);
      console.error('❌ Payment error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      maxWidth: '400px', 
      margin: '20px auto', 
      padding: '20px', 
      border: '1px solid #ddd',
      borderRadius: '8px',
      backgroundColor: '#f9f9f9'
    }}>
      <h3>💳 Payment Details - ${(amount / 100).toFixed(2)}</h3>
      
      {!clientSecret ? (
        <p>⏳ Loading payment form...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{ 
            border: '1px solid #e1e8ed', 
            borderRadius: '8px', 
            padding: '12px', 
            marginBottom: '20px',
            backgroundColor: 'white'
          }}>
            <CardElement 
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                },
              }}
            />
          </div>
          
          {error && (
            <div style={{ 
              color: '#d63031', 
              margin: '10px 0', 
              padding: '10px', 
              backgroundColor: '#fab1a0',
              borderRadius: '4px',
              border: '1px solid #e17055'
            }}>
              ❌ {error}
            </div>
          )}
          
          {success && (
            <div style={{ 
              color: '#00b894', 
              margin: '10px 0', 
              padding: '10px', 
              backgroundColor: '#55efc4',
              borderRadius: '4px',
              border: '1px solid #00b894'
            }}>
              ✅ Payment successful!
            </div>
          )}
          
          <button 
            type="submit" 
            disabled={!stripe || !clientSecret || loading}
            style={{
              width: '100%',
              padding: '12px',
              background: loading ? '#b2bec3' : '#5469d4',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold'
            }}
          >
            {loading ? '⏳ Processing...' : `💳 Pay $${(amount / 100).toFixed(2)}`}
          </button>
        </form>
      )}
    </div>
  );
};

export default PaymentForm;