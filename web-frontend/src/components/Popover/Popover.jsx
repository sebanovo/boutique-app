import { useState, useRef, useEffect } from "react";
import css from "./Css/Popover.module.css";

export function Popover({ botonTexto, children }) {
  const [abierto, setAbierto] = useState(false);
  const popRef = useRef();

  // Alternar popover
  const toggle = () => setAbierto((a) => !a);

  // Cerrar si se hace clic fuera
  useEffect(() => {
    const cerrar = (e) => {
      if (popRef.current && !popRef.current.contains(e.target)) setAbierto(false);
    };
    document.addEventListener("mousedown", cerrar);
    return () => document.removeEventListener("mousedown", cerrar);
  }, []);

  return (
    <>
      <button className={css.boton} onClick={toggle}>{botonTexto}</button>
      {abierto && (
        <div className={css.overlay}>
          <div className={css.popover} ref={popRef}>
            {children}
          </div>
        </div>
      )}
    </>
  );
}
