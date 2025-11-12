import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { ToastContainer } from 'react-toastify'; // ✅ Importa ToastContainer
import 'react-toastify/dist/ReactToastify.css';  // ✅ Importa los estilos

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import { Url_Barra } from './App_rutas/barra';
import { Local } from './pages/ventas/Local';
import { SignUpPages } from './pages/SignUpPage';
import { Index } from './pages/Index';
import { Formulario } from './components/Formulario/Formulario';
import { Prueba } from './components/Formulario/Prueba';

const stripePromise = loadStripe("pk_test_51RRklm4Zqdn7RVeS6rpZkRzHEQb5ZsZ3ud3Lj7SdElZskhVK0c2kbzXX7OHRDbriJ4u1MBNriwpPXUB89lS9LHi900U2jWD6it");

function App() {
  return (
    <Elements stripe={stripePromise}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/local' element={<Local />} />
          <Route path='/signup' element={<SignUpPages />} />
          <Route path='/index' element={<Index />} />
          <Route path='/new' element={<Formulario />} />
          <Route path='/peo' element={<Prueba />} />
          {Url_Barra()}
        </Routes>

        {/* ✅ Contenedor global para los Toast */}
        <ToastContainer
          position="top-right"
          autoClose={2500}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </BrowserRouter>
    </Elements>
  );
}

export default App;
