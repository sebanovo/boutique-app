import { useState, useEffect } from 'react';
import { server } from '../../utils/server';

export default function IngresosSalidasContent() {
  const [registros, setRegistros] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [extranjeros, setExtranjeros] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  // Estado para el formulario
  const [formData, setFormData] = useState({
    fecha: '',
    tipo: 'ingreso',
    modo: 'pie',
    es_extranjero: false,
    id_usuario: '',
    extranjero: '',
  });

  // Cargar registros, usuarios y extranjeros al montar el componente
  useEffect(() => {
    fetchRegistros();
    fetchUsuarios();
    fetchExtranjeros();
  }, []);

  const fetchRegistros = async () => {
    setLoading(true);
    try {
      const response = await server().getIngresosSalidas();
      setRegistros(response);
      setError('');
    } catch (error) {
      console.error('Error al cargar registros:', error);
      setError('Error al cargar los registros de ingreso/salida');
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

  const fetchExtranjeros = async () => {
    try {
      const response = await server().getExtranjeros();
      setExtranjeros(response);
    } catch (error) {
      console.error('Error al cargar extranjeros:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToSend = {
        fecha: formData.fecha,
        tipo: formData.tipo,
        modo: formData.modo,
        es_extranjero: formData.es_extranjero,
      };

      // Agregar solo uno de los dos: usuario o extranjero
      if (formData.es_extranjero && formData.extranjero) {
        dataToSend.extranjero = parseInt(formData.extranjero);
      } else if (!formData.es_extranjero && formData.id_usuario) {
        dataToSend.id_usuario = parseInt(formData.id_usuario);
      }

      await server().createIngresoSalida(dataToSend);

      // Limpiar formulario y recargar lista
      setFormData({
        fecha: '',
        tipo: 'ingreso',
        modo: 'pie',
        es_extranjero: false,
        id_usuario: '',
        extranjero: '',
      });
      setShowForm(false);
      await fetchRegistros();
    } catch (error) {
      console.error('Error al crear registro:', error);
      setError('Error al crear el registro de ingreso/salida');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const getTipoColor = (tipo) => {
    return tipo === 'ingreso'
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-red-100 text-red-800 border-red-200';
  };

  const getModoIcon = (modo) => {
    const icons = {
      pie: '🚶',
      auto: '🚗',
      moto: '🏍️',
      bici: '🚲',
      otro: '🚪',
    };
    return icons[modo] || icons['otro'];
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

  const getPersonaNombre = (registro) => {
    if (registro.es_extranjero) {
      return registro.extranjero
        ? `${registro.extranjero.nombre} (Extranjero)`
        : 'Extranjero no encontrado';
    } else {
      return registro.usuario ? registro.usuario.username : 'Usuario no encontrado';
    }
  };

  // Estadísticas
  const ingresosHoy = registros.filter(
    (r) => r.tipo === 'ingreso' && new Date(r.fecha).toDateString() === new Date().toDateString()
  ).length;

  const salidasHoy = registros.filter(
    (r) => r.tipo === 'salida' && new Date(r.fecha).toDateString() === new Date().toDateString()
  ).length;

  const extranjerosHoy = registros.filter(
    (r) => r.es_extranjero && new Date(r.fecha).toDateString() === new Date().toDateString()
  ).length;

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-bold text-gray-900'>Control de Ingresos y Salidas</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className='rounded-lg bg-green-600 px-4 py-2 text-white transition hover:bg-green-700'
        >
          {showForm ? 'Cancelar' : '🚪 Registrar Movimiento'}
        </button>
      </div>

      {error && (
        <div className='rounded border border-red-200 bg-red-50 px-4 py-3 text-red-700'>
          {error}
        </div>
      )}

      {/* Formulario para registrar movimiento */}
      {showForm && (
        <div className='rounded-lg border bg-white p-6 shadow'>
          <h2 className='mb-4 text-xl font-semibold'>Registrar Ingreso/Salida</h2>
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
                <label className='mb-1 block text-sm font-medium text-gray-700'>
                  Tipo de Movimiento *
                </label>
                <select
                  name='tipo'
                  value={formData.tipo}
                  onChange={handleInputChange}
                  required
                  className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none'
                >
                  <option value='ingreso'>Ingreso</option>
                  <option value='salida'>Salida</option>
                </select>
              </div>

              <div>
                <label className='mb-1 block text-sm font-medium text-gray-700'>
                  Modo de Ingreso *
                </label>
                <select
                  name='modo'
                  value={formData.modo}
                  onChange={handleInputChange}
                  required
                  className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none'
                >
                  <option value='pie'>A pie</option>
                  <option value='auto'>Auto</option>
                  <option value='moto'>Moto</option>
                  <option value='bici'>Bicicleta</option>
                  <option value='otro'>Otro</option>
                </select>
              </div>

              <div className='flex items-center'>
                <input
                  type='checkbox'
                  name='es_extranjero'
                  checked={formData.es_extranjero}
                  onChange={handleInputChange}
                  className='h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500'
                />
                <label className='ml-2 block text-sm text-gray-900'>Es visitante extranjero</label>
              </div>

              {formData.es_extranjero ? (
                <div className='md:col-span-2'>
                  <label className='mb-1 block text-sm font-medium text-gray-700'>
                    Visitante Extranjero *
                  </label>
                  <select
                    name='extranjero'
                    value={formData.extranjero}
                    onChange={handleInputChange}
                    required={formData.es_extranjero}
                    className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none'
                  >
                    <option value=''>Seleccionar extranjero</option>
                    {extranjeros.map((extranjero) => (
                      <option key={extranjero.id} value={extranjero.id}>
                        {extranjero.nombre} - CI: {extranjero.ci}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className='md:col-span-2'>
                  <label className='mb-1 block text-sm font-medium text-gray-700'>
                    Residente *
                  </label>
                  <select
                    name='id_usuario'
                    value={formData.id_usuario}
                    onChange={handleInputChange}
                    required={!formData.es_extranjero}
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
              )}
            </div>

            <div className='flex space-x-3'>
              <button
                type='submit'
                disabled={loading}
                className='rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:bg-gray-400'
              >
                {loading ? 'Registrando...' : 'Registrar Movimiento'}
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
            <div className='rounded-full bg-green-100 p-3'>
              <span className='text-xl text-green-600'>📊</span>
            </div>
            <div className='ml-4'>
              <p className='text-sm text-gray-600'>Total Registros</p>
              <p className='text-2xl font-bold'>{registros.length}</p>
            </div>
          </div>
        </div>

        <div className='rounded-lg bg-white p-4 shadow'>
          <div className='flex items-center'>
            <div className='rounded-full bg-blue-100 p-3'>
              <span className='text-xl text-blue-600'>⬇️</span>
            </div>
            <div className='ml-4'>
              <p className='text-sm text-gray-600'>Ingresos Hoy</p>
              <p className='text-2xl font-bold'>{ingresosHoy}</p>
            </div>
          </div>
        </div>

        <div className='rounded-lg bg-white p-4 shadow'>
          <div className='flex items-center'>
            <div className='rounded-full bg-red-100 p-3'>
              <span className='text-xl text-red-600'>⬆️</span>
            </div>
            <div className='ml-4'>
              <p className='text-sm text-gray-600'>Salidas Hoy</p>
              <p className='text-2xl font-bold'>{salidasHoy}</p>
            </div>
          </div>
        </div>

        <div className='rounded-lg bg-white p-4 shadow'>
          <div className='flex items-center'>
            <div className='rounded-full bg-purple-100 p-3'>
              <span className='text-xl text-purple-600'>🌎</span>
            </div>
            <div className='ml-4'>
              <p className='text-sm text-gray-600'>Extranjeros Hoy</p>
              <p className='text-2xl font-bold'>{extranjerosHoy}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de registros */}
      <div className='overflow-hidden rounded-lg bg-white shadow'>
        <div className='border-b border-gray-200 px-6 py-4'>
          <h2 className='text-lg font-semibold'>Registros de Ingresos y Salidas</h2>
        </div>

        {loading ? (
          <div className='p-6 text-center'>
            <div className='inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-green-600'></div>
            <p className='mt-2 text-gray-600'>Cargando registros...</p>
          </div>
        ) : registros.length === 0 ? (
          <div className='p-6 text-center text-gray-500'>No hay registros de ingresos/salidas</div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                    Fecha
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                    Persona
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                    Tipo
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                    Modo
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                    Tipo Persona
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200 bg-white'>
                {registros.map((registro) => (
                  <tr key={registro.id} className='hover:bg-gray-50'>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm font-medium text-gray-900'>
                        {formatFecha(registro.fecha)}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-900'>{getPersonaNombre(registro)}</div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getTipoColor(registro.tipo)}`}
                      >
                        {registro.tipo.toUpperCase()}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex items-center'>
                        <span className='mr-2 text-lg'>{getModoIcon(registro.modo)}</span>
                        <span className='text-sm text-gray-900 capitalize'>{registro.modo}</span>
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-900'>
                        {registro.es_extranjero ? 'Visitante Extranjero' : 'Residente'}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
