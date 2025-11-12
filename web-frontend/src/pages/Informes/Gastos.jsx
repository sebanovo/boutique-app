import {Barra} from '../../components/BarraMenu/Barra';
import { Titulo } from '../../components/Cabesera/Titulo';
import { Formulario } from '../../components/Formulario/Formulario';
import {Tabla} from '../../components/Table/Tabla';
import { Popover } from '../../components/Popover/Popover';
const data12 = {
    Titulo: 'Regitrar Gastos',
    Backendt:'/api/venta/costo/crear/',
    Input: [
        "descripcion-Descripcion:-text",
        "monto-Monto del Pago:-number",
        "url-Foto del comprobante:-file",
    ],
    Recibir: [
        {
            Ruta:'api/venta/tipos-costo/', 
            name: "tipoGasto",
            items: ["value", "label"]
        },
    ]
};
const data11 = {
    ruta: "/api/venta/costo/extraer/",
    eliminar: "/api/venta/costo/eliminar/",
    cabesera: ["Tipo", "Monto", "Fecha", "Persona"],
    valor: ["tipo", "monto", "fecha", "persona"]

  };

export function Gastos(){
    return(
        <Barra>
            <Titulo 
                icon='Cash' 
                titulo='Gasto De Servivcios' 
                subtitulo='gasto diario, 
                mensuales por costos y servicios'
            />
            <Titulo icon='wallet' subtitulo='Gastos Indirectos '>
                <br />
                {<Formulario data={data12}/>} <br /><br />
                <Tabla data={data11}/>               
            </Titulo>
            <Titulo icon='person' subtitulo='Pagos de Salarios '>
                <br />

                <Popover botonTexto='Pagos Pendientes'>

                </Popover>
                
            </Titulo>
        </Barra>
    );
}