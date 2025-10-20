import { useState, useEffect } from 'react';
import { server } from '../../utils/server';

export default function ReservasContent() {
  const [reservas, setReservas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  // Estado para el formulario
  const [formData, setFormData] = useState({
    fecha: '',
    estado_pago: 'pendiente',
    metodo_pago: 'efectivo',
    id_usuario: '',
    id_area: '',
  });

  // Cargar reservas, usuarios y áreas al montar el componente
  useEffect(() => {
    fetchReservas();
    fetchUsuarios();
    fetchAreas();
  }, []);

  const fetchReservas = async () => {
    setLoading(true);
    try {
      const response = await server().getReservas();
      setReservas(response);
      setError('');
    } catch (error) {
      console.error('Error al cargar reservas:', error);
      setError('Error al cargar las reservas');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsuarios = async () => {
    try {
      const response = await server().getUsuarios();
      setUsuarios(response);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    }
  };

  const fetchAreas = async () => {
    try {
      const response = await server().getAreasComunes();
      setAreas(response);
    } catch (error) {
      console.error('Error al cargar áreas:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await server().createReserva({
        fecha: formData.fecha,
        estado_pago: formData.estado_pago,
        metodo_pago: formData.metodo_pago,
        id_usuario: parseInt(formData.id_usuario),
        id_area: parseInt(formData.id_area),
      });

      // Limpiar formulario y recargar lista
      setFormData({
        fecha: '',
        estado_pago: 'pendiente',
        metodo_pago: 'efectivo',
        id_usuario: '',
        id_area: '',
      });
      setShowForm(false);
      await fetchReservas(); // Recargar la lista
    } catch (error) {
      console.error('Error al crear reserva:', error);
      setError('Error al crear la reserva');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getEstadoPagoColor = (estado) => {
    const colors = {
      pendiente: 'bg-yellow-100 text-yellow-800',
      pagado: 'bg-green-100 text-green-800',
      cancelado: 'bg-red-100 text-red-800',
    };
    return colors[estado] || colors['pendiente'];
  };

  const getMetodoPagoIcon = (metodo) => {
    const icons = {
      efectivo: '💵',
      tarjeta: '💳',
      qr: '📱',
    };
    return icons[metodo] || '💰';
  };

  const formatFecha = (fechaString) => {
    const fecha = new Date(fechaString);
    return new Intl.DateTimeFormat('es-BO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(fecha);
  };

  const getUsuarioNombre = (idUsuario) => {
    const usuario = usuarios.find((u) => u.id === idUsuario);
    return usuario ? `${usuario.username} (${usuario.email})` : 'Usuario no encontrado';
  };

  const getAreaNombre = (idArea) => {
    const area = areas.find((a) => a.id === idArea);
    return area ? area.nombre : 'Área no encontrada';
  };

  const getAreaCosto = (idArea) => {
    const area = areas.find((a) => a.id === idArea);
    return area ? area.costo : 0;
  };

  // Filtrar reservas por estado
  const reservasPendientes = reservas.filter((r) => r.estado_pago === 'pendiente');
  const reservasPagadas = reservas.filter((r) => r.estado_pago === 'pagado');
  const reservasCanceladas = reservas.filter((r) => r.estado_pago === 'cancelado');

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-bold text-gray-900'>Gestión de Reservas</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className='rounded-lg bg-green-600 px-4 py-2 text-white transition hover:bg-green-700'
        >
          {showForm ? 'Cancelar' : '📅 Nueva Reserva'}
        </button>
      </div>

      {error && (
        <div className='rounded border border-red-200 bg-red-50 px-4 py-3 text-red-700'>
          {error}
        </div>
      )}

      {/* Formulario para crear reserva */}
      {showForm && (
        <div className='rounded-lg bg-white p-6 shadow'>
          <h2 className='mb-4 text-xl font-semibold'>Crear Nueva Reserva</h2>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div>
                <label className='mb-1 block text-sm font-medium text-gray-700'>
                  Fecha y Hora *
                </label>
                <input
                  type='datetime-local'
                  name='fecha'
                  value={formData.fecha}
                  onChange={handleInputChange}
                  required
                  className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none'
                />
              </div>

              <div>
                <label className='mb-1 block text-sm font-medium text-gray-700'>Área Común *</label>
                <select
                  name='id_area'
                  value={formData.id_area}
                  onChange={handleInputChange}
                  required
                  className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none'
                >
                  <option value=''>Seleccionar área</option>
                  {areas.map((area) => (
                    <option key={area.id} value={area.id}>
                      {area.nombre} -{' '}
                      {new Intl.NumberFormat('es-BO', {
                        style: 'currency',
                        currency: 'BOB',
                      }).format(area.costo)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className='mb-1 block text-sm font-medium text-gray-700'>Residentes *</label>
                <select
                  name='id_usuario'
                  value={formData.id_usuario}
                  onChange={handleInputChange}
                  required
                  className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none'
                >
                  <option value=''>Seleccionar residente</option>
                  {usuarios.map((usuario) => (
                    <option key={usuario.id} value={usuario.id}>
                      {usuario.username} - {usuario.email}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className='mb-1 block text-sm font-medium text-gray-700'>
                  Estado de Pago *
                </label>
                <select
                  name='estado_pago'
                  value={formData.estado_pago}
                  onChange={handleInputChange}
                  required
                  className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none'
                >
                  <option value='pendiente'>Pendiente</option>
                  <option value='pagado'>Pagado</option>
                  <option value='cancelado'>Cancelado</option>
                </select>
              </div>

              <div>
                <label className='mb-1 block text-sm font-medium text-gray-700'>
                  Método de Pago *
                </label>
                <select
                  name='metodo_pago'
                  value={formData.metodo_pago}
                  onChange={handleInputChange}
                  required
                  className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none'
                >
                  <option value='efectivo'>Efectivo</option>
                  <option value='tarjeta'>Tarjeta</option>
                  <option value='qr'>QR</option>
                </select>
              </div>
            </div>

            <div className='flex space-x-3'>
              <button
                type='submit'
                disabled={loading}
                className='rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:bg-gray-400'
              >
                {loading ? 'Creando...' : 'Crear Reserva'}
              </button>
              <button
                type='button'
                onClick={() => setShowForm(false)}
                className='rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600'
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Estadísticas rápidas */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
        <div className='rounded-lg bg-white p-4 shadow'>
          <div className='flex items-center'>
            <div className='rounded-full bg-blue-100 p-3'>
              <span className='text-xl text-blue-600'>📅</span>
            </div>
            <div className='ml-4'>
              <p className='text-sm text-gray-600'>Total Reservas</p>
              <p className='text-2xl font-bold'>{reservas.length}</p>
            </div>
          </div>
        </div>

        <div className='rounded-lg bg-white p-4 shadow'>
          <div className='flex items-center'>
            <div className='rounded-full bg-yellow-100 p-3'>
              <span className='text-xl text-yellow-600'>⏳</span>
            </div>
            <div className='ml-4'>
              <p className='text-sm text-gray-600'>Pendientes</p>
              <p className='text-2xl font-bold'>{reservasPendientes.length}</p>
            </div>
          </div>
        </div>

        <div className='rounded-lg bg-white p-4 shadow'>
          <div className='flex items-center'>
            <div className='rounded-full bg-green-100 p-3'>
              <span className='text-xl text-green-600'>✅</span>
            </div>
            <div className='ml-4'>
              <p className='text-sm text-gray-600'>Pagadas</p>
              <p className='text-2xl font-bold'>{reservasPagadas.length}</p>
            </div>
          </div>
        </div>

        <div className='rounded-lg bg-white p-4 shadow'>
          <div className='flex items-center'>
            <div className='rounded-full bg-red-100 p-3'>
              <span className='text-xl text-red-600'>❌</span>
            </div>
            <div className='ml-4'>
              <p className='text-sm text-gray-600'>Canceladas</p>
              <p className='text-2xl font-bold'>{reservasCanceladas.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de reservas */}
      <div className='overflow-hidden rounded-lg bg-white shadow'>
        <div className='border-b border-gray-200 px-6 py-4'>
          <h2 className='text-lg font-semibold'>Reservas Registradas</h2>
        </div>

        {loading ? (
          <div className='p-6 text-center'>
            <div className='inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-green-600'></div>
            <p className='mt-2 text-gray-600'>Cargando reservas...</p>
          </div>
        ) : reservas.length === 0 ? (
          <div className='p-6 text-center text-gray-500'>No hay reservas registradas</div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                    Fecha
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                    Área
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                    Residentes
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                    Estado Pago
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                    Método Pago
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                    Costo
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200 bg-white'>
                {reservas.map((reserva) => (
                  <tr key={reserva.id} className='hover:bg-gray-50'>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm font-medium text-gray-900'>
                        {formatFecha(reserva.fecha)}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-900'>
                        {reserva.area?.nombre || getAreaNombre(reserva.id_area)}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-900'>
                        {reserva.usuario?.username || getUsuarioNombre(reserva.id_usuario)}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getEstadoPagoColor(reserva.estado_pago)}`}
                      >
                        {reserva.estado_pago}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex items-center'>
                        <span className='mr-2 text-lg'>
                          {getMetodoPagoIcon(reserva.metodo_pago)}
                        </span>
                        <span className='text-sm text-gray-900 capitalize'>
                          {reserva.metodo_pago}
                        </span>
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm font-semibold text-green-600'>
                        {new Intl.NumberFormat('es-BO', {
                          style: 'currency',
                          currency: 'BOB',
                        }).format(reserva.area?.costo || getAreaCosto(reserva.id_area))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Vista en tarjetas para móviles */}
      <div className='grid grid-cols-1 gap-4 md:hidden'>
        {reservas.map((reserva) => (
          <div key={reserva.id} className='rounded-lg border bg-white p-4 shadow'>
            <div className='mb-3 flex items-start justify-between'>
              <div>
                <h3 className='font-semibold text-gray-900'>
                  {reserva.area?.nombre || getAreaNombre(reserva.id_area)}
                </h3>
                <p className='text-sm text-gray-600'>{formatFecha(reserva.fecha)}</p>
              </div>
              <span
                className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getEstadoPagoColor(reserva.estado_pago)}`}
              >
                {reserva.estado_pago}
              </span>
            </div>

            <div className='space-y-2 text-sm'>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Residente:</span>
                <span className='font-medium'>
                  {reserva.usuario?.username || getUsuarioNombre(reserva.id_usuario)}
                </span>
              </div>

              <div className='flex justify-between'>
                <span className='text-gray-600'>Método pago:</span>
                <span className='font-medium capitalize'>
                  {getMetodoPagoIcon(reserva.metodo_pago)} {reserva.metodo_pago}
                </span>
              </div>

              <div className='flex justify-between'>
                <span className='text-gray-600'>Costo:</span>
                <span className='font-semibold text-green-600'>
                  {new Intl.NumberFormat('es-BO', {
                    style: 'currency',
                    currency: 'BOB',
                  }).format(reserva.area?.costo || getAreaCosto(reserva.id_area))}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
