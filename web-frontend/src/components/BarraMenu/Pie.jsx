import Css from './Css/Barra.module.css';
export function Pie(){
    return(
        <div className={Css.pie}>
            <div className={Css.datos}>
                <div className={Css.subdatosimg}>
                </div>
                <div className={Css.subdatos1}>
                    <span>{localStorage.getItem('usuario')}</span>
                    <p>{localStorage.getItem('correo')}</p>
                </div>
                <div className={Css.subdatos2}>
                    <ion-icon name="ellipsis-vertical-outline"></ion-icon>
                </div>
            </div>
        </div>
    );
}