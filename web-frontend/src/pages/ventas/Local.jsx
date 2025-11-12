import { Barra } from './../../components/BarraMenu/Barra';
import { useState, useEffect } from 'react';
import { Inputcarrito } from '../../components/Input_codigo_barra';
import {Titulo} from '../../components/Cabesera/Titulo';
import {Formulario} from '../../components/Formulario/Formulario';

export function Local() {
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState(null);
  const [car, setCar] = useState([]); // carrito compartido

  // Cargar productos
  const extraerProducto = async () => {
    try {
      const response = await fetch("/api/venta/producto/extraer/");
      const data = await response.json();
      setProductos(data);
    } catch (err) {
      setError("Error al cargar productos: " + err.message);
    }
  };

  useEffect(() => {
    extraerProducto();
  }, []);

  const data = {
    Titulo: 'Confirmar Venta',
    Backendt:'/api/venta/pedido/local/', // Cambié esta ruta para que envíe la venta completa
    Input: [
      "nit-NIT:-text",
      "nombre-Nombre:-text", // Corregí el typo (faltaba :)
      "apellido-Apellido:-text",
      "Correo-Correo:-email",
    ],
    Recibir: [
        {
            Ruta:'/api/venta/tipoPago/extraer/', 
            name: "tipo_pago", // Cambié a minúscula para consistencia
            items: ["id", "nombre"]
        },
    ],
    carrito: car // ✅ Agregué el carrito aquí
};
  return (
    <Barra>
      <Titulo icon='storefront' titulo='Ventas Local'/>
      {/* Pasa setCar al hijo */}
      <Inputcarrito setcar={setCar} />
      <Formulario data={data}/>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </Barra>
  );
}