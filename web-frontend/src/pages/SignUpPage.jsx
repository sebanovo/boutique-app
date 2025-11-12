import Css from './SignUpPage.module.css';
import { useState } from 'react';

export function SignUpPages() {
  const [usuario, setUsuario] = useState({
    username: "",
    nombre: "",
    apellidop: "",
    apellidom: "",
    telefono: "",
    email: "",
    password: "",
    confirmarPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuario({ ...usuario, [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('🔵 INICIANDO ENVÍO DE DATOS:', usuario);
  
    if (usuario.password !== usuario.confirmarPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }
  
    try {
      console.log('🟡 ENVIANDO PETICIÓN...');
      
      const response = await fetch('/api/venta/usuario/cliente/crear/', {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest"
        },
        body: JSON.stringify(usuario),
      });
  
      console.log('🟢 RESPUESTA RECIBIDA - Status:', response.status);
      console.log('🟢 Headers:', Object.fromEntries(response.headers.entries()));
  
      // Verificar si la respuesta tiene contenido
      const responseText = await response.text();
      console.log('🟢 Respuesta completa:', responseText);
  
      let data;
      if (responseText) {
        try {
          data = JSON.parse(responseText);
          console.log('🟢 JSON parseado:', data);
        } catch (jsonError) {
          console.error('🔴 Error parseando JSON:', jsonError);
          throw new Error(`Respuesta inválida del servidor: ${responseText.substring(0, 100)}...`);
        }
      } else {
        throw new Error('Respuesta vacía del servidor');
      }
  
      if (!response.ok) {
        throw new Error(data.error || `Error ${response.status}: ${response.statusText}`);
      }
  
      console.log('✅ USUARIO CREADO EXITOSAMENTE:', data);
      alert('Usuario creado correctamente');
      
      // Reset form
      setUsuario({
        username: "",
        nombre: "",
        apellidop: "",
        apellidom: "",
        telefono: "",
        email: "",
        password: "",
        confirmarPassword: "",
      });
  
    } catch (error) {
      console.error('🔴 ERROR COMPLETO:', error);
      alert(`Error: ${error.message}`);
    }
  };
  

  return (
    <div className={Css.caja1}>
      <div className={Css.caja2}>
        <h1 className={Css.titulo}>Registro de Usuario</h1><br />
        <form onSubmit={handleSubmit}>
          <label>Nombre:</label><br />
          <input name="nombre" value={usuario.nombre} onChange={handleChange} type="text" required /><br />

          <label>Apellido P.:</label><br />
          <input name="apellidop" value={usuario.apellidop} onChange={handleChange} type="text" /><br />

          <label>Apellido M.:</label><br />
          <input name="apellidom" value={usuario.apellidom} onChange={handleChange} type="text" /><br />

          <label>Teléfono:</label><br />
          <input name="telefono" value={usuario.telefono} onChange={handleChange} type="text" /><br />

          <label>Nombre de Usuario:</label><br />
          <input name="username" value={usuario.username} onChange={handleChange} type="text" required /><br />

          <label>Email:</label><br />
          <input name="email" value={usuario.email} onChange={handleChange} type="email" required /><br />

          <label>Password:</label><br />
          <input name="password" value={usuario.password} onChange={handleChange} type="password" required /><br />

          <label>Confirmar Password:</label><br />
          <input name="confirmarPassword" value={usuario.confirmarPassword} onChange={handleChange} type="password" required /><br />

          <hr />
          <button type="submit">Registrarse</button><br />
        </form>
        <a href="/">Regresar</a>
      </div>
    </div>
  );
}
