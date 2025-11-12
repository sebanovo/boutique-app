import React, { useState, useEffect } from 'react';
import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import { clearCart } from '../../pages/ventas/cartStorage';  // ✅ Importa tu función que limpia el carrito
import { getCart } from "../../pages/ventas/cartStorage"

const PaymentFormDetailed = ({ amount = 1000,lat,log}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isFormReady, setIsFormReady] = useState(false);

  // 🔹 Crear el PaymentIntent al cargar el componente
  useEffect(() => {
    createPaymentIntent(amount);
  }, [amount]);

  const createPaymentIntent = async (amount) => {
    try {
      const response = await fetch(`/api/venta/create-payment/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });

      const data = await response.json();
      if (response.ok && data.clientSecret) {
        setClientSecret(data.clientSecret);
        setIsFormReady(true);
      } else {
        setError(data.error || 'Error al crear el intento de pago.');
      }
    } catch (err) {
      setError('Error de red: ' + err.message);
    }
  };
  const carritoCompleto = getCart(); // obtiene items + total

 // obtengo los datos de pago 
const data = {
  longitud: log,   // ojo: corregí "logitud" → "longitud"
  latitud: lat,
  carrito: carritoCompleto,
  monto:amount
};

const enviar_data = async () => {
  try {
    // ✅ Validar datos antes de enviar
    if (!log || !lat) {
      console.error('❌ Faltan coordenadas');
      return false;
    }

    const data = {
      longitud: log,
      latitud: lat,
      carrito: carritoCompleto,
      monto: amount / 100  // ✅ Convertir de centavos a unidades
    };

    console.log('📤 Enviando datos:', data);

    const response = await fetch('/api/venta/pedido/cliente/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCSRFToken(), // ✅ Si usas CSRF
      },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      const resultado = await response.json();
      console.log('✅ Pedido registrado:', resultado);
      return true;
    } else {
      const errorData = await response.json();
      console.error('❌ Error al enviar pedido:', errorData);
      return false;
    }
  } catch (error) {
    console.error('❌ Error de red:', error);
    return false;
  }
};

// ✅ Función auxiliar para CSRF (si lo necesitas)
const getCSRFToken = () => {
  const name = 'csrftoken';
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
};


  // 🔹 Enviar el formulario
const handleSubmit = async (event) => {
  event.preventDefault();
  setLoading(true);
  setError('');

  if (!stripe || !elements) {
    setError('Stripe aún no está cargado.');
    setLoading(false);
    return;
  }

  const cardNumber = elements.getElement(CardNumberElement);

  try {
    const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardNumber,
        billing_details: { name: 'Cliente Test' },
      },
    });

    if (stripeError) {
      setError(`Pago fallido: ${stripeError.message}`);
    } else if (paymentIntent.status === 'succeeded') {
      setSuccess(true);
      
      // ✅ Esperar a que se envíen los datos antes de limpiar el carrito
      const envioExitoso = await enviar_data();
      
      if (envioExitoso) {
        clearCart();
      } else {
        setError('Pago exitoso pero error al registrar pedido');
      }
    }
  } catch (err) {
    setError('Error en el proceso de pago: ' + err.message);
  }

  setLoading(false);
};

  const elementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#32325d',
        '::placeholder': { color: '#aab7c4' },
      },
      invalid: { color: '#e25950' },
    },
  };

  return (
    <div
  style={{
    maxWidth: '800px',      // No crecerá más de 800px
    width: '50vw',           // Ocupa el 90% del contenedor en pantallas pequeñas
    margin: '20px auto',    // Centrado horizontal
    padding: '30px',
    border: '1px solid #e1e8ed',
    borderRadius: '12px',
    backgroundColor: 'white',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    boxSizing: 'border-box', // Para que padding no aumente el ancho
  }}
>

      {!clientSecret ? (
        <p>⏳ Cargando formulario de pago...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label>Número de tarjeta</label>
            <div style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '8px' }}>
              <CardNumberElement options={elementOptions} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1 }}>
              <label>Expiración</label>
              <div style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '8px' }}>
                <CardExpiryElement options={elementOptions} />
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <label>CVC</label>
              <div style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '8px' }}>
                <CardCvcElement options={elementOptions} />
              </div>
            </div>
          </div>

          {error && <p style={{ color: 'red' }}>{error}</p>}
          {success && <p style={{ color: 'green' }}>✅ ¡Pago exitoso! Tu carrito fue vaciado.</p>}
          
          <button
            disabled={!stripe || !clientSecret || loading}
            style={{
              marginTop: '20px',
              width: '100%',
              padding: '12px',
              border: 'none',
              borderRadius: '8px',
              backgroundColor: '#2563eb',
              color: 'white',
              cursor: 'pointer'
            }}>
            {loading ? '⏳ Procesando...' : `💳 Pagar $${(amount / 100).toFixed(2)}`}
          </button>
        </form>
      )}
    </div>
  );
};

export default PaymentFormDetailed;
