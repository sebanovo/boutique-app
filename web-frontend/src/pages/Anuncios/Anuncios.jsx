import { Barra } from "../../components/BarraMenu/Barra";
import {Titulo} from "../../components/Cabesera/Titulo";
import { Formulario } from "../../components/Formulario/Formulario";

const data = {
    Titulo: 'Crear Promoción',
    Backendt: '/api/venta/promocion/crear/',
    Input: [
      "nombre-Nombre-text",
      "descripcion-Descripcion-text",
    ],
    Recibir: [
     
    ]
  };

export function Anuncios(){
    return(
        <Barra>
            <Titulo titulo='Anuncios y comunicados'/>
            <Formulario data={data}/>
        </Barra>
    );
}