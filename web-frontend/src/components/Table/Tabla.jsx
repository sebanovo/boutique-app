import { useState, useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";
import Css from "./Tabla.module.css";
import { toast } from "react-toastify";

export function Tabla({ data }) {
  const [datos, setDatos] = useState([]);
  const [modal, setModal] = useState(null);

  // ✅ Cargar datos desde el backend
  const cargarDatos = async () => {
  try {
    const res = await fetch(data.ruta);
    if (!res.ok) throw new Error();
    const json = await res.json();
    
    console.log("Respuesta completa:", json); // Para debug
    
    let datosArray;
    
    // Detectar automáticamente el formato
    if (Array.isArray(json)) {
      datosArray = json;
      console.log("✅ Formato: Array directo");
    } else if (json.data !== undefined) {
      datosArray = Array.isArray(json.data) ? json.data : [json.data];
      console.log("✅ Formato: Objeto con campo 'data'");
    } else {
      datosArray = [json];
      console.log("✅ Formato: Objeto simple");
    }
    
    console.log("Datos a mostrar:", datosArray);
    setDatos(datosArray);
    
  } catch (error) {
    console.error("Error cargando datos:", error);
    setModal({ estado: false, mensaje: "Error al cargar los datos" });
  }
};
 

  // ✅ Eliminar registro
  const eliminar = async (id) => {
    const original = [...datos];
    setDatos((prev) => prev.filter((d) => d.id !== id));
    try {
      const res = await fetch(`${data.eliminar}${id}/`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setModal({ estado: true, mensaje: "Eliminado correctamente" });
      toast.success("✅ Eliminado correctamente");
    } catch {
      setModal({ estado: false, mensaje: "Error al eliminar" });
      toast.error("❌ Error al eliminar");
      setDatos(original);
    }
    
    
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // ✅ Código de barras
  // ✅ Código de barras seguro
const Barcode = ({ value }) => {
  const svg = useRef();

  useEffect(() => {
    if (svg.current && value && value !== "—") {
      try {
        JsBarcode(svg.current, String(value), {
          width: 2,
          height: 45,
          displayValue: false,
          margin: 0,
        });
      } catch (err) {
        console.error("Error generando código de barras:", err);
      }
    }
  }, [value]);

  // Si el valor no es válido, mostrar un texto o nada
  return value && value !== "—" ? (
    <svg ref={svg} className={Css.barcode}></svg>
  ) : (
    <span className={Css.textCell}>Sin código</span>
  );
};


  // ✅ Render de columnas
  const render = (item, campo) => {
    const [key, tipo] = campo.split("-");
    let val = item[key] ?? "—";
  
    // Formatear fechas
    if (tipo === "d" && val !== "—") {
      const date = new Date(val);
      val = date.toLocaleDateString("es-BO") + " " + date.toLocaleTimeString("es-BO");
    }
  
    switch (tipo) {
      case "f":
        return <img src={val} alt="imagen" className={Css.imageCell} />;
      case "c":
        return <Barcode value={val} />;
      default:
        return <span className={Css.textCell}>{val}</span>;
    }
  };
  

  return (
    <div className={Css.container}>

      <table className={Css.table}>
        <thead className={Css.tableHeader}>
          <tr>
            {data.cabesera.map((c, i) => (
              <th key={i}>{c}</th>
            ))}
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {datos.length > 0 ? (
            datos.map((item, i) => (
              <tr key={i}>
                {data.valor.map((col, j) => (
                  <td key={j}>{render(item, col)}</td>
                ))}
                <td className={Css.actionsCell}>
                  <button className={Css.editButton}>Editar</button>
                  <button
                    className={Css.deleteButton}
                    onClick={() => eliminar(item.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={data.cabesera.length + 1} className={Css.emptyState}>
                No hay datos disponibles
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
