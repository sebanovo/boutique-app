import Css from './Titulo.module.css';

export function Titulo({ icon, titulo, subtitulo ,children}) {
  const name = `${icon}-outline`; // ← forma correcta del nombre del ícono

  return (
    <header className={Css.header}>
      <div className={Css.headerContent}>
        <h1 className={Css.titulo}>
          <ion-icon name={name}></ion-icon>
          {titulo}
        </h1>
        {subtitulo && ( // ← muestra solo si existe
          <p className={Css.subtitulo}>{subtitulo}</p>
        )}
        <center>{children}</center>
      </div>
    </header>
  );
}
