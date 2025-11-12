import { useState } from 'react';
import Css from './Css/Barra.module.css';
import { Cabeza } from './Cabeza';
import { Cuerpo } from './Cuerpo';
import { Pie } from './Pie';

export function Barra({ children }) {
  const [barraVisible, setBarraVisible] = useState(true);

  const toggleBarra = () => setBarraVisible(!barraVisible);

  return (
    <div className={Css.contenedor}>
      <aside className={`${Css.aside} ${barraVisible ? '' : Css.oculto}`}>
        <Cabeza />
        <Cuerpo />
        <Pie />
      </aside>

      <main className={`${Css.main} ${barraVisible ? Css.conBarra : Css.sinBarra}`}>
        <div className={Css.botonFlotante} onClick={toggleBarra}>
          <ion-icon name={barraVisible ? "close-outline" : "menu-outline"}></ion-icon>
        </div>
        <div className={Css.contenido}>
          {children}
        </div>
      </main>
    </div>
  );
}
