import Css from './Css/Barra.module.css';
import { useState } from 'react';
import { MenuItem } from './MenuItem';
import { Item } from './Item';

export function Cuerpo() {
  const [menuActivo, setMenuActivo] = useState(null);

  const toggleSubmenu = (menu) => {
    setMenuActivo(menuActivo === menu ? null : menu);
  };

  return (
    <div className={Css.cuerpo}>
      <ul>
        <MenuItem Icono="newspaper-outline"
          Titulo="Informes"
          abierto={menuActivo === 'Informes'}
          onClick={() => toggleSubmenu('Informes')}
        >
          <Item Titulo="Dashboard" enlace="/Dashboard" />
          <Item Titulo="Estado de resultados" enlace="/EstadoResultados" />
          <Item Titulo="Gastos de Servicios" enlace="/Gastos" />
    
        </MenuItem>

        <MenuItem Icono="home-outline"
          Titulo="Personal"
          abierto={menuActivo === 'Personal'}
          onClick={() => toggleSubmenu('Personal')}
        >
          <Item Titulo="Trabajadores" enlace="/personal" />
          <Item Titulo="Horarios Trabajo" enlace="/" />
          <Item Titulo="Roles y permisos" enlace="/" />
          <Item Titulo="Apertura Caja" enlace="/Apertura-De-Caja" />
        
        </MenuItem>

        <MenuItem Icono="cart-outline"
          Titulo="Venta"
          abierto={menuActivo === 'Venta'}
          onClick={() => toggleSubmenu('Venta')}
        >
          <Item Titulo="Online" enlace="/venta" />
          <Item Titulo="Local" enlace="/Local" />
          <Item Titulo="Envios" enlace="/envio" />
          <Item Titulo="Reclamos" enlace="/venta" />
          
        </MenuItem>

        <MenuItem Icono="albums-outline"
          Titulo="Productos"
          abierto={menuActivo === 'Productos'}
          onClick={() => toggleSubmenu('Productos')}
        >
          <Item Titulo="Producto" enlace="/productos" />
          <Item Titulo="Categoria" enlace="/categoria" />
          <Item Titulo="Actulizar Inventario" enlace="/ActualizarProductos" />
        </MenuItem>

        <MenuItem Icono="notifications-outline"
          Titulo="Anuncios"
          abierto={menuActivo === 'Anuncios'}
          onClick={() => toggleSubmenu('Anuncios')}
        >
          <Item Titulo="Reclamos" enlace="" />
          <Item Titulo="Anuncios" enlace="/Anuncios" />
          <Item Titulo="Promociones" enlace="/Promociones" />


        </MenuItem>
        <Item  icon='cube' Titulo="Anuncios" enlace="" />
        
      </ul>
    </div>
  );
}
