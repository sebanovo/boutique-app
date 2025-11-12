import { Barra } from "../../components/BarraMenu/Barra";
import { Titulo } from "../../components/Cabesera/Titulo";
export function ActualizarProductos(){
    return(
        <Barra>
            <Titulo icon='file-tray-full' titulo="Actualizar Inventario" subtitulo='control de Almacen (Stock)'/>

        </Barra>
    );
}