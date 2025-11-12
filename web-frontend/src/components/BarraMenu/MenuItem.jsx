import Css from './Css/Barra.module.css';

export function MenuItem({ Icono, Titulo, children, abierto, onClick }) {
  return (
    <li className={`${Css.menuItem} ${abierto ? Css.activo : ''}`}>
      <div className={Css.submenuCabecera} onClick={onClick}>
        <ion-icon name={Icono}></ion-icon>
        <span>{Titulo}</span>
        <ion-icon
          name="chevron-down-outline"
          className={`${Css.chevron} ${abierto ? Css.abierto : ''}`}
        ></ion-icon>
      </div>
      <ul className={`${Css.submenuContenido} ${abierto ? Css.desplegado : ''}`}>
        {children}
      </ul>
    </li>
  );
}
