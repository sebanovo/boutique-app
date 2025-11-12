import { useState, useEffect } from "react";
import Css from './model.module.css';

export function Model({ estado = true, mensaje = "Operación exitosa" }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Si llega un nuevo mensaje, mostramos el modal
    if (mensaje) {
      setVisible(true);

      const timer = setTimeout(() => setVisible(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [estado, mensaje]); // se ejecuta cada vez que cambian las props

  if (!visible) return null;

  const icon = estado ? "✅" : "👺";
  const tipoClase = estado ? Css.success : Css.error;

  return (
    <div className={Css.caja1}>
      <div className={`${Css.caja2} ${tipoClase}`}>
        <h1 className={Css.h1Modal}>{icon}</h1>
        <h2>{mensaje}</h2>
      </div>
    </div>
  );
}
