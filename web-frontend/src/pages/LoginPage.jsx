import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CSS from './../pages/Pages_Jhonata/css/Fondo.module.css';
import { server } from '../utils/Axios';

function LoginPage() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setUsuario({ ...usuario, [e.target.name]: e.target.value });
    setError(''); // Limpiar error cuando el usuario escriba
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validación básica
    if (!usuario.email || !usuario.password) {
      setError('Por favor completa todos los campos');
      setLoading(false);
      return;
    }

    try {
      const response = await server.post('/venta/login/', usuario);
      
      if (response.data.success) {
        const usuario = response.data.nombre
        const correo = response.data.correo
        localStorage.setItem('usuario',usuario)
        localStorage.setItem('correo',correo)
        navigate('/Index');
      } else {
        setError(response.data.message || 'Credenciales incorrectas');
      }
    } catch (err) {
      console.error('Error en login:', err);
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'Error al iniciar sesión');
      } else {
        setError('Error de conexión. Intenta nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={CSS.fondo}>
      <div className={CSS.subfondo}>
        <h1 className={CSS.titulo}>Login</h1>
        {error && <p className={CSS.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className={CSS.formGroup}>
            <label htmlFor="email">Correo:</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={usuario.email} 
              onChange={handleChange} 
              placeholder="correo@ejemplo.com" 
              required 
            />
          </div>
          <div className={CSS.formGroup}>
            <label htmlFor="password">Contraseña:</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              value={usuario.password} 
              onChange={handleChange} 
              placeholder="Tu contraseña" 
              required 
            />
          </div>
          <div className={CSS.formGroup}>
            <button type="submit" className={CSS.boton} disabled={loading}>
              {loading ? 'Iniciando...' : 'Iniciar sesión'}
            </button>
          </div>
        </form>
        <p className={CSS.textoRegistro}>
          ¿No tienes cuenta? <Link to="/signup" className={CSS.linkRegistro}>Crear usuario</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;