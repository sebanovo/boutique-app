import { Barra } from "../../components/BarraMenu/Barra";
import { useState, useEffect } from "react";
import Css from './css/Envio.module.css';

export function Envio() {
    const [pedidos, setPedidos] = useState([]);
    const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
    const [modalConfirmacion, setModalConfirmacion] = useState(null);

    useEffect(() => {
        const fetchPedidos = async () => {
            const response = await fetch('/api/venta/pedido/onlinne/'); // tu endpoint real
            const data = await response.json();
            if (data.success) {
                setPedidos(data.data);
            }
        };
        fetchPedidos();
    }, []);

    // Enviar al backend que el pedido fue entregado
    const confirmarEntrega = async (id) => {
        try {
            const res = await fetch(`api/venta/pedido/entregar/${id}/`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
            });
            if (res.ok) {
                setPedidos(pedidos.map(p => p.id === id ? { ...p, estado: "Entregado" } : p));
                alert("Pedido entregado correctamente");
            } else {
                alert("Error al entregar el pedido");
            }
        } catch (error) {
            console.error(error);
            alert("Error de conexión con el servidor");
        } finally {
            setModalConfirmacion(null);
        }
    };

    const pedidosEnEspera = pedidos.filter(pedido => pedido.estado.toLowerCase() === "espera");
    const pedidosEntregados = pedidos.filter(pedido => pedido.estado.toLowerCase() === "entregado");

    const calcularTotalProductos = (productos) => 
        productos.reduce((acc, item) => acc + item.cantidad, 0);

    return (
        <Barra>
            {/* HEADER */}
            <header className={Css.header}>
                <div className={Css.headerContent}>
                    <h1 className={Css.titulo}>
                        <ion-icon name="cube-outline"></ion-icon>
                        Gestión de Pedidos
                    </h1>
                    <p className={Css.subtitulo}>
                        {pedidosEnEspera.length} pendientes • {pedidosEntregados.length} entregados
                    </p>
                </div>
            </header>

            {/* PEDIDOS EN ESPERA */}
            <section className={Css.seccion}>
                <div className={Css.seccionHeader}>
                    <div className={Css.seccionInfo}>
                        <h2 className={Css.seccionTitulo}>
                            <ion-icon name="time-outline"></ion-icon>
                            Pedidos en Espera
                        </h2>
                        <span className={Css.contador}>{pedidosEnEspera.length}</span>
                    </div>
                    <p className={Css.seccionDescripcion}>Pedidos listos para ser entregados</p>
                </div>

                {pedidosEnEspera.length === 0 ? (
                    <div className={Css.estadoVacio}>
                        <ion-icon name="checkmark-circle-outline"></ion-icon>
                        <h3>¡Excelente trabajo!</h3>
                        <p>No hay pedidos pendientes</p>
                    </div>
                ) : (
                    <div className={Css.gridPedidos}>
                        {pedidosEnEspera.map(pedido => (
                            <div key={pedido.id} className={`${Css.pedidoCard} ${pedidoSeleccionado?.id === pedido.id ? Css.seleccionado : ''}`}>
                                <div className={Css.pedidoHeader}>
                                    <div className={Css.clienteInfo}>
                                        <h3 className={Css.pedidoNombre}>{pedido.cliente}</h3>
                                        <p className={Css.pedidoFecha}>Nro {pedido.id || " horario"}</p>
                                    </div>
                                    <span className={Css.pedidoEstado}>Pendiente</span>
                                </div>

                                <div className={Css.pedidoInfo}>
                                    <div className={Css.infoRow}>
                                        <div className={Css.infoItem}>
                                            <ion-icon name="shirt-outline"></ion-icon>
                                            <span>{calcularTotalProductos(pedido.productos)} prendas</span>
                                        </div>
                                        <div className={Css.montoContainer}>
                                            <span className={Css.montoLabel}>Total:</span>
                                            <span className={Css.monto}>${pedido.total}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className={Css.pedidoAcciones}>
                                    <button className={Css.botonVer} onClick={() => setPedidoSeleccionado(pedidoSeleccionado?.id === pedido.id ? null : pedido)}>
                                        <ion-icon name="eye-outline"></ion-icon>
                                        {pedidoSeleccionado?.id === pedido.id ? 'Ocultar' : 'Ver'}
                                    </button>
                                    <button className={Css.botonTomar} onClick={() => setModalConfirmacion(pedido)}>
                                        <ion-icon name="checkmark-outline"></ion-icon>
                                        Entregar
                                    </button>
                                </div>

                                {pedidoSeleccionado?.id === pedido.id && (
                                    <div className={Css.detallesExpandidos}>
                                        <div className={Css.detalleGrupo}>
                                            <h4>Productos</h4>
                                            <div className={Css.listaProductos}>
                                                {pedido.productos.map((prod, index) => (
                                                    <div key={index} className={Css.productoTag}>
                                                        {/* Solo nombre y cantidad, sin imagen */}
                                                        <span>{prod.producto} x {prod.cantidad}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Modal de confirmación */}
{modalConfirmacion && (
  <div className={Css.modalOverlay}>
    <div className={Css.modalDashboard}>
      <h3>Confirmación de entrega</h3>
      <p>¿Confirmas que deseas entregar el pedido de <strong>{modalConfirmacion.cliente}</strong>?</p>
      <div className={Css.modalActions}>
        <button className={Css.botonConfirmar} onClick={() => confirmarEntrega(modalConfirmacion.id)}>Confirmar</button>
        <button className={Css.botonCancelar} onClick={() => setModalConfirmacion(null)}>Cancelar</button>
      </div>
    </div>
  </div>
)}


            {/* PEDIDOS ENTREGADOS */}
            <section className={Css.seccion}>
                <div className={Css.seccionHeader}>
                    <div className={Css.seccionInfo}>
                        <h2 className={Css.seccionTitulo}>
                            <ion-icon name="checkmark-done-outline"></ion-icon>
                            Pedidos Entregados
                        </h2>
                        <span className={`${Css.contador} ${Css.contadorEntregado}`}>{pedidosEntregados.length}</span>
                    </div>
                    <p className={Css.seccionDescripcion}>Pedidos completados exitosamente</p>
                </div>

                {pedidosEntregados.length === 0 ? (
                    <div className={Css.estadoVacio}>
                        <ion-icon name="cube-outline"></ion-icon>
                        <h3>No hay entregas aún</h3>
                        <p>Los pedidos entregados aparecerán aquí</p>
                    </div>
                ) : (
                    <div className={Css.gridPedidos}>
                        {pedidosEntregados.map(pedido => (
                            <div key={pedido.id} className={Css.pedidoCard}>
                                <div className={Css.pedidoHeader}>
                                    <div className={Css.clienteInfo}>
                                        <h3 className={Css.pedidoNombre}>{pedido.cliente}</h3>
                                        <p className={Css.pedidoFecha}>{pedido.horario_envios || "Sin horario"}</p>
                                    </div>
                                    <span className={`${Css.pedidoEstado} ${Css.entregado}`}>Entregado</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </Barra>
    );
}
