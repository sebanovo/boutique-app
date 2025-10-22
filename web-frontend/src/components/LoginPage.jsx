import React, { useState } from "react";
import { login } from "../services/api";
import "./LoginPage.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await login(email, password);
    if (data.error) setError(data.error);
    else alert("Bienvenido " + data.user);
  };

  return (
    <div className="login-container">
      <h2>Inicio de sesión de cliente</h2>
      <form onSubmit={handleSubmit}>
        <label>Correo electrónico *</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label>Contraseña *</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        {error && <p className="error">{error}</p>}
        <button type="submit">Iniciar sesión</button>
      </form>
    </div>
  );
}
