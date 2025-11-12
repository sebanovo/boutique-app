import { Formulario } from "../../components/Formulario/Formulario";
import { Barra } from "../../components/BarraMenu/Barra";
import { Titulo } from "../../components/Cabesera/Titulo";
import { Tabla } from "../../components/Table/Tabla";

export function Promociones() {
  const data = {
    Titulo: 'Crear Promoción',
    Backendt: '/api/venta/promocion/crear/',
    Input: [
      "nombre-Nombre-text",
      "url-Imagen:-file",
      "fecha_inicio-Inicio:-date",
      "fecha_fin-Fin:-date",
      "descripcion-Descripcion-text",
      "porcentaje-Descuento (1 al 100):-number",
    ],
    Recibir: [
      {
        Ruta: '/api/venta/producto/extraer/',
        name: "Productos-MasDeUno",
        items: ["id", "nombre"]
      },
    ]
  };

  const data1 = {
    ruta: "/api/venta/promocion/extraer/",
    eliminar: "/api/venta/promocion/eliminar/", 
    cabesera: ["foto","Código", "Nombre", "Inicio", "Fin", "Descuento", "Creador"],
    valor: ["url-f","id-t", "nombre", "fecha_inicio", "fecha_fin", "porcentaje", "creado_por"]
  };

  return (
    <Barra>
      <Titulo
        icon='bookmarks'
        titulo="Gestión De Promoción"
        subtitulo='Para crear una promoción presione en crear'
      />
      <br />
      <Formulario data={data} /><br /><br />
      <Tabla data={data1} />
    </Barra>
  );
}
