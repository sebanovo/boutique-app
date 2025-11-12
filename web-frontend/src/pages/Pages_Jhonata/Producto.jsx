import { Barra } from "../../components/BarraMenu/Barra";
import { Formulario } from "../../components/Formulario/Formulario";
import { Tabla } from "../../components/Table/Tabla";
import { Titulo } from "../../components/Cabesera/Titulo";
export function Producto() {
    const data1 = {
        ruta: "api/venta/extraer",
        cabesera: ["Foto", "Nombre", "Cantidad", "Precio", "Costo", "Código de barra", "Creado", "Categoría"],
        valor: ["url-f", "nombre-t", "cantidad-t", "precio-t", "costo_unitario-t", "codigo_barra-c", "creado_en", "categoria__nombre"]
      };
      
  const data = {
    Titulo: 'Crear Producto',
    Backendt:'api/venta/producto/crear/',
    Input: [
        "nombre-Nombre-text",
        "cantidad-Cantidad:-number",
        "precio-Precio:-number",
        "codigo-Codigo:-text",
        "url-url-file",
        "costo_unitario-costo unitario-number"
    ],
    Recibir: [
        {
            Ruta:'api/venta/categoria/extraer/', 
            name: "categoria",
            items: ["id", "nombre"]
        },
    ]
};

return(
    <Barra>
           <Titulo icon='shirt' titulo="Gestion de Producto" subtitulo='para crear nuevo producto en el boton inferior'/>
           <Formulario data={data}/>
        <br /><br />
            <Tabla data={data1}/>
    </Barra>
);
}