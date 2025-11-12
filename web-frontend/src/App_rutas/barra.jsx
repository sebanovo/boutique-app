import { Route } from 'react-router-dom';
import { Index } from '../pages/Pages_Jhonata/Index';
import { Producto } from '../pages/Pages_Jhonata/Producto';
import { Categoria } from '../pages/Pages_Jhonata/Categoria';
import { Venta } from '../pages/Pages_Jhonata/Venta';
import {Local} from './../pages/ventas/Local';
import {Personal} from './../pages/Personal/Personal';
import { Envio } from '../pages/ventas/Envios';
import { Promociones } from '../pages/Anuncios/Promociones';
import { ActualizarProductos } from '../pages/Producto/ActualizarPrductos';
import { Dashboard } from '../pages/Informes/Dashboard';
import { EstadoResultados } from '../pages/Anuncios/EstadoDeResultado';
import { Gastos } from '../pages/Informes/Gastos';
import { AperturaDeCaja } from '../pages/Personal/AperturaDeCaja';
import { Anuncios } from '../pages/Anuncios/Anuncios';
export function Url_Barra(){
    return [
        <Route key='principal' path='/new' element={<Index />} />,
        <Route key='curd' path='/productos' element={<Producto />} />,
        <Route key='crud' path='/Categoria' element={<Categoria />} />,
        <Route key='VentaOnline' path='/venta' element={<Venta />} />,
        <Route path='/Local' element={<Local />} />,
        <Route path='/personal' element={<Personal />} />,
        <Route path='/Envio' element={<Envio />} />,
        <Route path='/Promociones' element={<Promociones />} />,
        <Route path='/ActualizarProductos' element={<ActualizarProductos />} />,
        <Route path='/Dashboard' element={<Dashboard />} />,
        <Route path='/EstadoResultados' element={<EstadoResultados />} />,
        <Route path='/Gastos' element={<Gastos />} />,
        <Route path='/Apertura-De-Caja' element={<AperturaDeCaja />} />,
        <Route path='/Anuncios' element={<Anuncios />} />,

    ];
}