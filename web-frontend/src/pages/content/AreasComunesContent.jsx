import { useState, useEffect } from 'react';
import { server } from '../../utils/server';

export default function AreasComunesContent() {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  // Estado para el formulario
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    horario: '',
    costo: '',
  });

  // Cargar áreas comunes al montar el componente
  useEffect(() => {
    fetchAreas();
  }, []);

  const fetchAreas = async () => {
    setLoading(true);
    try {
      const response = await server().getAreasComunes();
      setAreas(response);
      setError('');
    } catch (error) {
      console.error('Error al cargar áreas comunes:', error);
      setError('Error al cargar las áreas comunes');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await server().createAreaComun({
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        horario: formData.horario,
        costo: parseFloat(formData.costo),
      });

      // Limpiar formulario y recargar lista
      setFormData({ nombre: '', descripcion: '', horario: '', costo: '' });
      setShowForm(false);
      await fetchAreas(); // Recargar la lista
    } catch (error) {
      console.error('Error al crear área común:', error);
      setError('Error al crear el área común');
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

  const formatCosto = (costo) => {
    return new Intl.NumberFormat('es-BO', {
      style: 'currency',
      currency: 'BOB',
    }).format(costo);
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-bold text-gray-900'>Gestión de Áreas Comunes</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className='rounded-lg bg-green-600 px-4 py-2 text-white transition hover:bg-green-700'
        >
          {showForm ? 'Cancelar' : '🏢 Agregar Área'}
        </button>
      </div>

      {error && (
        <div className='rounded border border-red-200 bg-red-50 px-4 py-3 text-red-700'>
          {error}
        </div>
      )}

      {/* Formulario para agregar área común */}
      {showForm && (
        <div className='rounded-lg bg-white p-6 shadow'>
          <h2 className='mb-4 text-xl font-semibold'>Registrar Nueva Área Común</h2>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div className='md:col-span-2'>
                <label className='mb-1 block text-sm font-medium text-gray-700'>
                  Nombre del Área *
                </label>
                <input
                  type='text'
                  name='nombre'
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required
                  className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none'
                  placeholder='Ej: Sala de disco, Piscina, Gimnasio'
                />
              </div>

              <div className='md:col-span-2'>
                <label className='mb-1 block text-sm font-medium text-gray-700'>
                  Descripción *
                </label>
                <textarea
                  name='descripcion'
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none'
                  placeholder='Describe el área común...'
                />
              </div>

              <div>
                <label className='mb-1 block text-sm font-medium text-gray-700'>Horario *</label>
                <input
                  type='text'
                  name='horario'
                  value={formData.horario}
                  onChange={handleInputChange}
                  required
                  className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none'
                  placeholder='Ej: Lun a Sab 8:00-22:00'
                />
              </div>

              <div>
                <label className='mb-1 block text-sm font-medium text-gray-700'>
                  Costo por uso (BOB) *
                </label>
                <input
                  type='number'
                  name='costo'
                  value={formData.costo}
                  onChange={handleInputChange}
                  required
                  min='0'
                  step='0.01'
                  className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none'
                  placeholder='Ej: 18.00'
                />
              </div>
            </div>

            <div className='flex space-x-3'>
              <button
                type='submit'
                disabled={loading}
                className='rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:bg-gray-400'
              >
                {loading ? 'Guardando...' : 'Registrar Área'}
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

      {/* Lista de áreas comunes */}
      <div className='overflow-hidden rounded-lg bg-white shadow'>
        <div className='border-b border-gray-200 px-6 py-4'>
          <h2 className='text-lg font-semibold'>Áreas Comunes Registradas</h2>
        </div>

        {loading ? (
          <div className='p-6 text-center'>
            <div className='inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-green-600'></div>
            <p className='mt-2 text-gray-600'>Cargando áreas comunes...</p>
          </div>
        ) : areas.length === 0 ? (
          <div className='p-6 text-center text-gray-500'>No hay áreas comunes registradas</div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                    Área
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                    Descripción
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                    Horario
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                    Costo
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                    Reservas
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200 bg-white'>
                {areas.map((area) => (
                  <tr key={area.id} className='hover:bg-gray-50'>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex items-center'>
                        <div>
                          <div className='text-sm font-semibold text-gray-900'>{area.nombre}</div>
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      <div className='max-w-xs text-sm text-gray-900'>{area.descripcion}</div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-900'>{area.horario}</div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm font-semibold text-green-600'>
                        {formatCosto(area.costo)}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-500'>
                        {area.reservas_count || 0} reservas
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Estadísticas rápidas */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
        <div className='rounded-lg bg-white p-4 shadow'>
          <div className='flex items-center'>
            <div className='rounded-full bg-green-100 p-3'>
              <span className='text-xl text-green-600'>🏢</span>
            </div>
            <div className='ml-4'>
              <p className='text-sm text-gray-600'>Total Áreas</p>
              <p className='text-2xl font-bold'>{areas.length}</p>
            </div>
          </div>
        </div>

        <div className='rounded-lg bg-white p-4 shadow'>
          <div className='flex items-center'>
            <div className='rounded-full bg-blue-100 p-3'>
              <span className='text-xl text-blue-600'>💰</span>
            </div>
            <div className='ml-4'>
              <p className='text-sm text-gray-600'>Ingreso Promedio</p>
              <p className='text-2xl font-bold'>
                {areas.length > 0
                  ? formatCosto(
                      areas.reduce((sum, area) => sum + parseFloat(area.costo), 0) / areas.length
                    )
                  : formatCosto(0)}
              </p>
            </div>
          </div>
        </div>

        <div className='rounded-lg bg-white p-4 shadow'>
          <div className='flex items-center'>
            <div className='rounded-full bg-amber-100 p-3'>
              <span className='text-xl text-amber-600'>📅</span>
            </div>
            <div className='ml-4'>
              <p className='text-sm text-gray-600'>Total Reservas</p>
              <p className='text-2xl font-bold'>
                {areas.reduce((total, area) => total + (area.reservas_count || 0), 0)}
              </p>
            </div>
          </div>
        </div>

        <div className='rounded-lg bg-white p-4 shadow'>
          <div className='flex items-center'>
            <div className='rounded-full bg-purple-100 p-3'>
              <span className='text-xl text-purple-600'>🏊</span>
            </div>
            <div className='ml-4'>
              <p className='text-sm text-gray-600'>Área Más Popular</p>
              <p className='truncate text-lg font-bold'>
                {areas.length > 0
                  ? areas.reduce((max, area) =>
                      (area.reservas_count || 0) > (max.reservas_count || 0) ? area : max
                    ).nombre
                  : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
