import { useEffect, useState } from "react";
import { Barra } from "../../components/BarraMenu/Barra";
import { Popover } from "../../components/Popover/Popover";
import Css from "./css/venta.module.css";
import { getCart, addToCart, removeFromCart, clearCart } from "../ventas/cartStorage";
import PaymentFormDetailed from "../../components/stripe/PaymentFormDetailed";
import MapaUbicacion from "../../components/Maps/MapaUbicacion";

export function Venta() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [carrito, setCarrito] = useState(getCart().items);
  const [loading, setLoading] = useState(false);
  const [log, setLog] = useState(null);
  const [lat, setLat] = useState(null);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("todos");

  // 🧩 Cargar productos y categorías
  const extraerProducto = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/venta/extraer/");
      const data = await response.json();
      setProductos(data);
    } catch (err) {
      setError("Error al cargar productos: " + err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const extraerCategoria = async () => {
    try {
      const response = await fetch("/api/venta/categoria/extraer/");
      const data = await response.json();
      setCategorias(data);
    } catch (err) {
      console.error("Error al cargar categorías: " + err.message);
    }
  };

  useEffect(() => {
    extraerProducto();
    extraerCategoria();
  }, []);

  // Filtrado por categoría y búsqueda
  const nombresCategorias = ["todos", ...categorias.map(cat => cat.nombre.toLowerCase())];

  const productosFiltrados = productos.filter((producto) => {
    const coincideBusqueda = producto.nombre
      .toLowerCase()
      .includes(busqueda.toLowerCase());
    const coincideCategoria =
      categoriaSeleccionada === "todos" ||
      (producto.categoria__nombre &&
        producto.categoria__nombre.toLowerCase() === categoriaSeleccionada.toLowerCase());
    return coincideBusqueda && coincideCategoria;
  });
   
  // 🛒 Carrito
  const agregarAlCarrito = (producto) => {
    const nuevoCarrito = addToCart({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: 1,
    });
    setCarrito(nuevoCarrito.items);
  };

  // En tu componente Venta, mejorar actualizarCantidad:
const actualizarCantidad = (id, nuevaCantidad) => {
  if (nuevaCantidad < 1) {
    eliminarDelCarrito(id); // ✅ Eliminar si cantidad es 0
    return;
  }
  
  const nuevoCarrito = carrito.map((item) =>
    item.id === id ? { ...item, cantidad: nuevaCantidad } : item
  );
  
  // ✅ Actualizar localStorage también
  const cart = getCart();
  cart.items = nuevoCarrito;
  cart.total = nuevoCarrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
  saveCart(cart);
  
  setCarrito(nuevoCarrito);
};

  const eliminarDelCarrito = (id) => {
    const nuevoCarrito = removeFromCart(id);
    setCarrito(nuevoCarrito.items);
  };

  const vaciarCarrito = () => {
    clearCart();
    setCarrito([]);
  };

  const total = carrito.reduce(
    (sum, item) => sum + item.precio * item.cantidad,
    0
  );

  return (
    <Barra>
      <div className={Css.contenedorPrincipal}>
        {/* HEADER */}
        <header className={Css.header}>
          <h1 className={Css.titulo}>🛍️ Catálogo de Productos</h1>

          <div className={Css.controlesSuperiores}>
            <input
              className={Css.inputBusqueda}
              type="text"
              placeholder="🔍 Buscar producto..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />

            <Popover botonTexto={`🧺 Carrito (${carrito.length})`}>
              <div className={Css.carrito}>
                {carrito.length === 0 ? (
                  <p className={Css.carritoVacio}>Tu carrito está vacío</p>
                ) : (
                  <>
                    <table className={Css.tablaCarrito}>
                      <thead>
                        <tr>
                          <th>Producto</th>
                          <th>Precio</th>
                          <th>Cantidad</th>
                          <th>Subtotal</th>
                          <th>Acción</th>
                        </tr>
                      </thead>
                      <tbody>
                        {carrito.map((item) => (
                          <tr key={item.id}>
                            <td>{item.nombre}</td>
                            <td>$us. {item.precio}</td>
                            <td>
                              <input
                                type="number"
                                min="1"
                                value={item.cantidad}
                                onChange={(e) =>
                                  actualizarCantidad(
                                    item.id,
                                    parseInt(e.target.value)
                                  )
                                }
                                className={Css.inputCantidad}
                              />
                            </td>
                            <td>$us. {(item.precio * item.cantidad).toFixed(2)}</td>
                            <td>
                              <button
                                className={Css.eliminar}
                                onClick={() => eliminarDelCarrito(item.id)}
                              >
                                🗑️
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div className={Css.resumen}>
                      <h2>Total: $us. {total.toFixed(2)}</h2>
                    </div>

                    <div className={Css.botonesCarrito}>
                      <div className={Css.contenedorMapaPago}>
                        <Popover botonTexto="Proceseder a Pagar">
                          <MapaUbicacion setLa={setLat} setLo={setLog} />
                          <PaymentFormDetailed amount={total * 100} lat={lat} log={log} />
                        </Popover>
                      </div>
                      
                    </div>
                  </>
                )}
              </div>
            </Popover>
          </div>
        </header>

        {/* CATEGORÍAS */}
        <section className={Css.seccionCategorias}>
          {nombresCategorias.map((cat) => (
            <button
              key={cat}
              className={`${Css.categoria} ${
                categoriaSeleccionada === cat ? Css.categoriaActiva : ""
              }`}
              onClick={() => setCategoriaSeleccionada(cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </section>

        {/* PRODUCTOS */}
        <section className={Css.seccionProductos}>
          {loading && <p className={Css.cargando}>Cargando productos...</p>}
          {error && <p className={Css.error}>{error}</p>}

          <div className={Css.gridProductos}>
            {productosFiltrados.length === 0 && !loading ? (
              <p className={Css.sinResultados}>No se encontraron productos</p>
            ) : (
              productosFiltrados.map((producto) => (
                <article key={producto.id} className={Css.tarjetaProducto}>
                  <div className={Css.contenedorImagen}>
                    <img src={producto.url} alt={producto.nombre} />
                  </div>

                  <div className={Css.detalleProducto}>
                    <h3>{producto.nombre}</h3>
                    <h4 style={{ color: "gray", fontSize: "14px" }}>
                      {producto.categoria__nombre || "Sin categoría"}
                    </h4>
                    <p className={Css.precio}>$us. {producto.precio}</p>
                    <div className={Css.estrellas}>
                      {[...Array(5)].map((_, i) => (
                        <ion-icon
                          key={i}
                          name={i < (producto.rating || 0) ? "star" : "star-outline"}
                        ></ion-icon>
                      ))}
                    </div>
                    <button
                      className={Css.botonAgregar}
                      onClick={() => agregarAlCarrito(producto)}
                    >
                      Agregar al carrito
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    </Barra>
  );
}
