import { useEffect, useState } from "react";
import { Barra } from "../../components/BarraMenu/Barra";
import { Popover } from "../../components/Popover/Popover";
import { Titulo } from "../../components/Cabesera/Titulo";

export function Categoria() {
  const [nombre, setNombre] = useState("");
  const [detalle, setDetalle] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");

  // Crear nueva categoría
  const handleCrear = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess("");

    if (!nombre.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }

    try {
      console.log("Enviando datos:", { nombre, detalle });
      
      const response = await fetch("/api/venta/categoria/crear/", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre, detalle }),
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      // Verificar si la respuesta tiene contenido
      const responseText = await response.text();
      console.log("Response text:", responseText);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      // Solo intentar parsear como JSON si hay contenido
      let data;
      if (responseText) {
        data = JSON.parse(responseText);
      } else {
        data = { message: "Categoría creada exitosamente" };
      }

      console.log("Categoría creada:", data);

      // Actualizar lista localmente y recargar categorías
      setNombre("");
      setDetalle("");
      setSuccess("Categoría creada exitosamente");
      extraerCategorias(); // Recargar la lista
      
    } catch (err) {
      console.error("Error completo:", err);
      setError(err.message);
    }
  };

  // Extraer todas las categorías
  const extraerCategorias = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Solicitando categorías...");
      
      const response = await fetch("/api/venta/categoria/extraer/");
      
      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      // Verificar si la respuesta tiene contenido
      const responseText = await response.text();
      console.log("Response text:", responseText);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      // Solo intentar parsear como JSON si hay contenido
      let data;
      if (responseText) {
        data = JSON.parse(responseText);
      } else {
        data = [];
      }

      console.log("Categorías recibidas:", data);
      setCategorias(data);
      
    } catch (err) {
      console.error("Error completo:", err);
      setError(`Error al cargar categorías: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    extraerCategorias();
  }, []);

  return (
    <Barra>
      <div className="p-6">
      <Titulo icon='shirt' titulo="Gestion de Categoria" subtitulo='para crear nuevo categoria en el boton inferior'/>
      
        
        {/* Mensajes de estado */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <Popover botonTexto="Crear Nueva Categoría">
          <form onSubmit={handleCrear} className="space-y-4">
            <h2 className="text-lg font-semibold">Crear Categoría</h2>
            
            <div>
              <label className="block text-sm font-medium mb-1">Nombre:</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ingrese el nombre de la categoría"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Descripción:</label>
              <input
                type="text"
                value={detalle}
                onChange={(e) => setDetalle(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ingrese una descripción (opcional)"
              />
            </div>
            
            <button 
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition duration-200"
            >
              Crear Categoría
            </button>
          </form>
        </Popover>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Categorías Existentes</h2>

          {loading && (
            <div className="text-center py-4">
              <p>Cargando categorías...</p>
            </div>
          )}
          
          {!loading && categorias.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              No hay categorías registradas.
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categorias.map((categoria) => (
              <div 
                key={categoria.id}
                className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold text-lg mb-2">{categoria.nombre}</h3>
                <p className="text-gray-600">
                  {categoria.detalle || "Sin descripción"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Barra>
  );
}