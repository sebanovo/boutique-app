import { useEffect, useState } from "react";

export function Inputcarrito({ setcar }) {
  const [valor, setValor] = useState("");
  const [productos, setProductos] = useState([]);
  const [carro, setCarro] = useState([]);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const response = await fetch("/api/venta/producto/extraer/");
        const data = await response.json();
        setProductos(data);
      } catch (error) {
        console.error("Error al cargar productos:", error);
        setMensaje("❌ Error al obtener productos.");
      }
    };
    cargarProductos();
  }, []);

  // 🔹 Sincroniza el carrito del hijo con el padre
  useEffect(() => {
    setcar(carro);
  }, [carro, setcar]);

  const agregarProducto = () => {
    const entrada = valor.trim();
    if (!entrada) return;

    const producto = productos.find(
      (p) =>
        p.codigo_barra === entrada ||
        p.id === parseInt(entrada) ||
        p.nombre.toLowerCase() === entrada.toLowerCase()
    );

    if (producto) {
      const existe = carro.find((e) => e.id === producto.id);
      if (!existe) {
        setCarro([...carro, { ...producto, cantidad: 1 }]);
        setMensaje(`✅ Producto "${producto.nombre}" agregado.`);
      } else {
        setMensaje("⚠️ Este producto ya está en el carrito.");
      }
    } else {
      setMensaje("❌ No se encontró el producto.");
    }
    setValor("");
  };

  const cambiarCantidad = (id, delta) => {
    setCarro((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, cantidad: Math.max(1, p.cantidad + delta) }
          : p
      )
    );
  };

  const eliminarProducto = (id) => {
    setCarro((prev) => prev.filter((p) => p.id !== id));
  };

  const total = carro.reduce((acc, p) => acc + p.precio * p.cantidad, 0);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      agregarProducto();
    }
  };

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "20px auto",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        backgroundColor: "#f9f9f9",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2 style={{ textAlign: "center", color: "#006371" }}>Registro de Venta</h2>

      <div style={{ marginBottom: "15px", textAlign: "center" }}>
        <input
          type="text"
          placeholder="Ingrese código, ID o nombre del producto"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          style={{
            width: "70%",
            padding: "8px 10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            marginRight: "10px",
          }}
        />
        <button
          onClick={agregarProducto}
          style={{
            padding: "8px 15px",
            borderRadius: "5px",
            border: "none",
            backgroundColor: "#006371",
            color: "white",
            cursor: "pointer",
          }}
        >
          Agregar
        </button>
      </div>

      {mensaje && (
        <p
          style={{
            color: mensaje.startsWith("✅")
              ? "green"
              : mensaje.startsWith("⚠️")
              ? "orange"
              : "red",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          {mensaje}
        </p>
      )}

      {carro.length > 0 && (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "20px",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#006371", color: "white" }}>
              <th>#</th>
              <th>Nombre</th>
              <th>Precio (Bs)</th>
              <th>Cantidad</th>
              <th>Subtotal</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {carro.map((p, i) => (
              <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "#f0f0f0" : "white", textAlign: "center" }}>
                <td>{i + 1}</td>
                <td>{p.nombre}</td>
                <td>{p.precio}</td>
                <td>{p.cantidad}</td>
                <td>{(p.precio * p.cantidad).toFixed(2)}</td>
                <td>
                  <button onClick={() => cambiarCantidad(p.id, +1)}>+</button>
                  <button onClick={() => cambiarCantidad(p.id, -1)}>-</button>
                  <button onClick={() => eliminarProducto(p.id)}>🗑</button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ backgroundColor: "#e1e1e1", fontWeight: "bold" }}>
              <td colSpan="4">TOTAL</td>
              <td>{total.toFixed(2)}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      )}
    </div>
  );
}
