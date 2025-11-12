import { Barra } from "../../components/BarraMenu/Barra"; 
import { Tabla } from "../../components/Table/Tabla";
import { Formulario } from "../../components/Formulario/Formulario";
import { Titulo } from '../../components/Cabesera/Titulo';
export  function Personal(){
    const data1 = {
        ruta: "/api/venta/persona/",
        cabesera: ["Foto","Código", "Paterno", "Materno", "Nombre", "Correo", "Rol", "Accion"],
        valor: ["foto-f","id-t", "apellidop", "apellidom", "nombre", "correo", "rol"]
      };
    const data = {
        Titulo: 'Crear',
        Backendt:'api/venta/usuario/Personal/crear/',
        Input: [
            "nombre-Nombre-text",
            "paterno-Paterno:-text",
            "materno-Materno:-text",
            "telefono-Telefono:-number",
            "eamil-correo-email",
        ],
        Recibir: [
            {
                Ruta:'api/venta/rol/', 
                name: "rol",
                items: ["id", "nombre"]
            },
        ]
    };
  
    return(
        <Barra>
            <Titulo icon='person' titulo="Gestion de Personal" sudtitulo=''/>
            <Formulario data={data}/>
            <br /><br />
                <Tabla data={data1}/>
        </Barra>
    );
}