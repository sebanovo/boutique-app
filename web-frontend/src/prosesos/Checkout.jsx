import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

function CheckoutForm({ paymentId, amount = 2500 }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje("");
    setError("");

    if (!stripe || !elements) {
      setError("Stripe no está cargado aún");
      setLoading(false);
      return;
    }

    try {
      // Llamada al backend para crear PaymentIntent - RUTA CORREGIDA
      const res = await fetch(`/api/venta/create-payment/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount, paymentId }),
      });

      if (!res.ok) {
        throw new Error("Error creando el payment intent");
      }

      const data = await res.json();
      const { clientSecret } = data;

      console.log("Client secret recibido:", clientSecret);

      // Confirmar pago
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        setError(result.error.message);
        console.error("Error de Stripe:", result.error);
      } else if (result.paymentIntent.status === "succeeded") {
        setMensaje("✅ Pago realizado con éxito");
        console.log("Pago exitoso:", result.paymentIntent);
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Error procesando el pago: " + error.message);
    }

    setLoading(false);
  };

  // Opciones de estilo para CardElement
  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
    hidePostalCode: true, // Ocultar campo de código postal si no lo necesitas
  };

  return (
    <div style={{ 
      maxWidth: '400px', 
      margin: '20px auto', 
      padding: '20px',
      border: '1px solid #e1e8ed',
      borderRadius: '8px',
      backgroundColor: 'white'
    }}>
      <h2>Pago #{paymentId}</h2>
      <p><strong>Monto:</strong> ${(amount / 100).toFixed(2)}</p>
      
      <form onSubmit={handleSubmit}>
        <div style={{ 
          border: '1px solid #e1e8ed', 
          borderRadius: '4px', 
          padding: '12px',
          marginBottom: '20px',
          backgroundColor: 'white'
        }}>
          <CardElement options={cardElementOptions} />
        </div>
        
        <button 
          type="submit" 
          disabled={!stripe || loading}
          style={{
            width: '100%',
            padding: '12px',
            background: loading ? '#cccccc' : '#5469d4',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? "Procesando..." : `Pagar $${(amount / 100).toFixed(2)}`}
        </button>
      </form>

      {error && (
        <div style={{ 
          color: '#d63031', 
          margin: '15px 0', 
          padding: '12px',
          backgroundColor: '#fab1a0',
          borderRadius: '4px'
        }}>
          ❌ {error}
        </div>
      )}

      {mensaje && (
        <div style={{ 
          color: '#00b894', 
          margin: '15px 0', 
          padding: '12px',
          backgroundColor: '#55efc4',
          borderRadius: '4px'
        }}>
          {mensaje}
        </div>
      )}

      {/* Información para pruebas */}
      <div style={{ 
        marginTop: '20px', 
        padding: '15px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '4px',
        fontSize: '14px'
      }}>
        <h4>💡 Para pruebas:</h4>
        <p><strong>Tarjeta:</strong> 4242 4242 4242 4242</p>
        <p><strong>Fecha:</strong> 12/34</p>
        <p><strong>CVC:</strong> 123</p>
      </div>
    </div>
  );
}

export default CheckoutForm;