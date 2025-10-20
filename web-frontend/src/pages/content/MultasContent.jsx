import { useState, useEffect } from 'react';
import { server } from '../../utils/server';

export default function MultasContent() {
  const [multas, setMultas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  // Estado para el formulario
  const [formData, setFormData] = useState({
    descripcion: '',
    monto: '',
    fecha: '',
    estado_pago: 'pendiente',
    metodo_pago: 'efectivo',
    id_usuario: '',
  });

  // Cargar multas y usuarios al montar el componente
  useEffect(() => {
    fetchMultas();
    fetchUsuarios();
  }, []);

  const fetchMultas = async () => {
    setLoading(true);
    try {
      const response = await server().getMultas();
      setMultas(response);
      setError('');
    } catch (error) {
      console.error('Error al cargar multas:', error);
      setError('Error al cargar las multas');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await server().createMulta({
        descripcion: formData.descripcion,
        monto: parseFloat(formData.monto),
        fecha: formData.fecha,
        estado_pago: formData.estado_pago,
        metodo_pago: formData.metodo_pago,
        id_usuario: parseInt(formData.id_usuario),
      });

      // Limpiar formulario y recargar lista
      setFormData({
        descripcion: '',
        monto: '',
        fecha: '',
        estado_pago: 'pendiente',
        metodo_pago: 'efectivo',
        id_usuario: '',
      });
      setShowForm(false);
      await fetchMultas(); // Recargar la lista
    } catch (error) {
      console.error('Error al crear multa:', error);
      setError('Error al crear la multa');
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
      pendiente: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      pagado: 'bg-green-100 text-green-800 border-green-200',
      cancelado: 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[estado] || colors['pendiente'];
  };

  const getMetodoPagoIcon = (metodo) => {
    const icons = {
      efectivo: '💵 Efectivo',
      tarjeta: '💳 Tarjeta',
      qr: '📱 QR',
    };
    return icons[metodo] || '💰';
  };

  const formatFecha = (fechaString) => {
    const fecha = new Date(fechaString);
    return new Intl.DateTimeFormat('es-BO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(fecha);
  };

  const formatMonto = (monto) => {
    return new Intl.NumberFormat('es-BO', {
      style: 'currency',
      currency: 'BOB',
    }).format(monto);
  };

  const getUsuarioNombre = (idUsuario) => {
    const usuario = usuarios.find((u) => u.id === idUsuario);
    return usuario ? `${usuario.username} (${usuario.email})` : 'Usuario no encontrado';
  };

  // Filtrar multas por estado
  const multasPendientes = multas.filter((m) => m.estado_pago === 'pendiente');
  const multasPagadas = multas.filter((m) => m.estado_pago === 'pagado');
  // const multasCanceladas = multas.filter((m) => m.estado_pago === 'cancelado');

  // Calcular totales
  const totalPendiente = multasPendientes.reduce((sum, multa) => sum + parseFloat(multa.monto), 0);
  const totalPagado = multasPagadas.reduce((sum, multa) => sum + parseFloat(multa.monto), 0);
  const totalGeneral = multas.reduce((sum, multa) => sum + parseFloat(multa.monto), 0);

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-bold text-gray-900'>Gestión de Multas</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className='rounded-lg bg-red-600 px-4 py-2 text-white transition hover:bg-red-700'
        >
          {showForm ? 'Cancelar' : '⚖️ Registrar Multa'}
        </button>
      </div>

      {error && (
        <div className='rounded border border-red-200 bg-red-50 px-4 py-3 text-red-700'>
          {error}
        </div>
      )}

      {/* Formulario para crear multa */}
      {showForm && (
        <div className='rounded-lg border border-red-200 bg-white p-6 shadow'>
          <h2 className='mb-4 text-xl font-semibold text-red-800'>Registrar Nueva Multa</h2>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div className='md:col-span-2'>
                <label className='mb-1 block text-sm font-medium text-gray-700'>
                  Descripción de la Multa *
                </label>
                <textarea
                  name='descripcion'
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none'
                  placeholder='Describe la infracción cometida...'
                />
              </div>

              <div>
                <label className='mb-1 block text-sm font-medium text-gray-700'>
                  Monto (BOB) *
                </label>
                <input
                  type='number'
                  name='monto'
                  value={formData.monto}
                  onChange={handleInputChange}
                  required
                  min='0'
                  step='0.01'
                  className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none'
                  placeholder='Ej: 100.00'
                />
              </div>

              <div>
                <label className='mb-1 block text-sm font-medium text-gray-700'>
                  Fecha de la Infracción *
                </label>
                <input
                  type='date'
                  name='fecha'
                  value={formData.fecha}
                  onChange={handleInputChange}
                  required
                  className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none'
                />
              </div>

              <div>
                <label className='mb-1 block text-sm font-medium text-gray-700'>
                  Residentes Multado *
                </label>
                <select
                  name='id_usuario'
                  value={formData.id_usuario}
                  onChange={handleInputChange}
                  required
                  className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none'
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
                  className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none'
                >
                  <option value='pendiente'>Pendiente</option>
                  <option value='pagado'>Pagado</option>
                  <option value='cancelado'>Cancelado</option>
                </select>
              </div>

              <div>
                <label className='mb-1 block text-sm font-medium text-gray-700'>
                  Método de Pago
                </label>
                <select
                  name='metodo_pago'
                  value={formData.metodo_pago}
                  onChange={handleInputChange}
                  className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none'
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
                className='rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:bg-gray-400'
              >
                {loading ? 'Registrando...' : 'Registrar Multa'}
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
        <div className='rounded-lg border bg-white p-4 shadow'>
          <div className='flex items-center'>
            <div className='rounded-full bg-red-100 p-3'>
              <span className='text-xl text-red-600'>⚖️</span>
            </div>
            <div className='ml-4'>
              <p className='text-sm text-gray-600'>Total Multas</p>
              <p className='text-2xl font-bold'>{multas.length}</p>
            </div>
          </div>
        </div>

        <div className='rounded-lg border border-yellow-200 bg-white p-4 shadow'>
          <div className='flex items-center'>
            <div className='rounded-full bg-yellow-100 p-3'>
              <span className='text-xl text-yellow-600'>⏳</span>
            </div>
            <div className='ml-4'>
              <p className='text-sm text-gray-600'>Pendientes</p>
              <p className='text-2xl font-bold'>{multasPendientes.length}</p>
              <p className='text-sm font-semibold text-yellow-600'>{formatMonto(totalPendiente)}</p>
            </div>
          </div>
        </div>

        <div className='rounded-lg border border-green-200 bg-white p-4 shadow'>
          <div className='flex items-center'>
            <div className='rounded-full bg-green-100 p-3'>
              <span className='text-xl text-green-600'>✅</span>
            </div>
            <div className='ml-4'>
              <p className='text-sm text-gray-600'>Pagadas</p>
              <p className='text-2xl font-bold'>{multasPagadas.length}</p>
              <p className='text-sm font-semibold text-green-600'>{formatMonto(totalPagado)}</p>
            </div>
          </div>
        </div>

        <div className='rounded-lg border border-red-200 bg-white p-4 shadow'>
          <div className='flex items-center'>
            <div className='rounded-full bg-red-100 p-3'>
              <span className='text-xl text-red-600'>💰</span>
            </div>
            <div className='ml-4'>
              <p className='text-sm text-gray-600'>Monto Total</p>
              <p className='text-2xl font-bold text-red-600'>{formatMonto(totalGeneral)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de multas */}
      <div className='overflow-hidden rounded-lg border bg-white shadow'>
        <div className='border-b border-gray-200 bg-red-50 px-6 py-4'>
          <h2 className='text-lg font-semibold text-red-800'>Multas Registradas</h2>
        </div>

        {loading ? (
          <div className='p-6 text-center'>
            <div className='inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-red-600'></div>
            <p className='mt-2 text-gray-600'>Cargando multas...</p>
          </div>
        ) : multas.length === 0 ? (
          <div className='p-6 text-center text-gray-500'>
            <div className='mb-2 text-4xl'>🎉</div>
            <p>No hay multas registradas</p>
            <p className='text-sm text-gray-400'>¡Excelente trabajo de los residentes!</p>
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                    Fecha
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                    Residentes
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                    Descripción
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                    Monto
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                    Estado
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                    Método Pago
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200 bg-white'>
                {multas.map((multa) => (
                  <tr key={multa.id} className='hover:bg-red-50'>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm font-medium text-gray-900'>
                        {formatFecha(multa.fecha)}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-900'>
                        {multa.usuario?.username || getUsuarioNombre(multa.id_usuario)}
                      </div>
                      <div className='text-xs text-gray-500'>{multa.usuario?.email}</div>
                    </td>
                    <td className='px-6 py-4'>
                      <div className='max-w-xs text-sm text-gray-900'>{multa.descripcion}</div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div
                        className={`text-sm font-bold ${
                          multa.estado_pago === 'pagado' ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {formatMonto(multa.monto)}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getEstadoPagoColor(multa.estado_pago)}`}
                      >
                        {multa.estado_pago.toUpperCase()}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-900'>
                        {multa.metodo_pago ? getMetodoPagoIcon(multa.metodo_pago) : 'No asignado'}
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
        {multas.map((multa) => (
          <div key={multa.id} className='rounded-lg border border-red-100 bg-white p-4 shadow'>
            <div className='mb-3 flex items-start justify-between'>
              <div>
                <h3 className='font-semibold text-gray-900'>
                  {multa.usuario?.username || getUsuarioNombre(multa.id_usuario)}
                </h3>
                <p className='text-sm text-gray-600'>{formatFecha(multa.fecha)}</p>
              </div>
              <span
                className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getEstadoPagoColor(multa.estado_pago)}`}
              >
                {multa.estado_pago}
              </span>
            </div>

            <div className='mb-3 space-y-2 text-sm'>
              <div>
                <span className='text-gray-600'>Descripción:</span>
                <p className='mt-1 font-medium'>{multa.descripcion}</p>
              </div>
            </div>

            <div className='flex items-center justify-between border-t border-gray-200 pt-3'>
              <div
                className={`text-lg font-bold ${
                  multa.estado_pago === 'pagado' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {formatMonto(multa.monto)}
              </div>
              <div className='text-sm text-gray-600'>
                {multa.metodo_pago ? getMetodoPagoIcon(multa.metodo_pago) : 'Sin método'}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Resumen financiero */}
      {multas.length > 0 && (
        <div className='rounded-lg border bg-white p-6 shadow'>
          <h3 className='mb-4 text-lg font-semibold text-gray-900'>Resumen Financiero</h3>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
            <div className='rounded-lg border p-4 text-center'>
              <div className='text-2xl font-bold text-yellow-600'>
                {formatMonto(totalPendiente)}
              </div>
              <div className='text-sm text-gray-600'>Por Cobrar</div>
            </div>
            <div className='rounded-lg border p-4 text-center'>
              <div className='text-2xl font-bold text-green-600'>{formatMonto(totalPagado)}</div>
              <div className='text-sm text-gray-600'>Recaudado</div>
            </div>
            <div className='rounded-lg border p-4 text-center'>
              <div className='text-2xl font-bold text-red-600'>{formatMonto(totalGeneral)}</div>
              <div className='text-sm text-gray-600'>Total Multas</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
