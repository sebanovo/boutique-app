import Css from './Css/Barra.module.css';
import { Link } from 'react-router-dom';

export function Item({ Titulo, enlace }) {
  return (
    <li className={Css.item}>
      <Link to={enlace}>
        <ion-icon name="arrow-forward-outline"></ion-icon>
        <span>{Titulo}</span>
      </Link>
    </li>
  );
}
