import { ToastContainer, toast } from "react-toastify";
import { useState } from "react";
import 'react-toastify/dist/ReactToastify.css';
import Css from './Prueba.module.css'; // crea este archivo para estilos

export function Prueba() {
  const [correo, setCorreo] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleClick = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      toast.error("Por favor ingresa un correo válido");
      return;
    }

    try {
      const res = await fetch("api/venta/enviar-correo/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, mensaje }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.status || "Correo enviado correctamente");
      } else {
        toast.error(data.status || "Error al enviar correo");
      }
    } catch (error) {
      toast.error("Error al conectarse con el servidor");
    }
  };

  return (
    <div className={Css.container}>
      <h2 className={Css.title}>Enviar correo</h2>
      <input
        className={Css.input}
        type="email"
        placeholder="Correo destinatario"
        value={correo}
        onChange={(e) => setCorreo(e.target.value)}
      />
      <textarea
        className={Css.textarea}
        placeholder="Mensaje"
        value={mensaje}
        onChange={(e) => setMensaje(e.target.value)}
      />
      <button className={Css.button} onClick={handleClick}>Enviar correo</button>
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}
