import { useState, useEffect } from 'react';
import { server } from '../../utils/server';

export default function CasasContent() {
  const [casas, setCasas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  // Estado para el formulario
  const [formData, setFormData] = useState({
    nro: '',
    categoria: '',
    capacidad: '',
  });

  // Cargar casas al montar el componente
  useEffect(() => {
    fetchCasas();
  }, []);

  const fetchCasas = async () => {
    setLoading(true);
    try {
      const response = await server().getCasas();
      setCasas(response);
      setError('');
    } catch (error) {
      console.error('Error al cargar casas:', error);
      setError('Error al cargar las casas');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await server().createCasa({
        nro: formData.nro.toString(),
        categoria: formData.categoria,
        capacidad: parseInt(formData.capacidad),
      });

      // Limpiar formulario y recargar lista
      setFormData({ nro: '', categoria: '', capacidad: '' });
      setShowForm(false);
      await fetchCasas(); // Recargar la lista
    } catch (error) {
      console.error('Error al crear casa:', error);
      setError('Error al crear la casa');
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

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-bold text-gray-900'>Gestión de Casas/Departamentos</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className='rounded-lg bg-green-600 px-4 py-2 text-white transition hover:bg-green-700'
        >
          {showForm ? 'Cancelar' : '➕ Agregar Casa'}
        </button>
      </div>

      {error && (
        <div className='rounded border border-red-200 bg-red-50 px-4 py-3 text-red-700'>
          {error}
        </div>
      )}

      {/* Formulario para agregar casa */}
      {showForm && (
        <div className='rounded-lg bg-white p-6 shadow'>
          <h2 className='mb-4 text-xl font-semibold'>Agregar Nueva Casa</h2>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
              <div>
                <label className='mb-1 block text-sm font-medium text-gray-700'>
                  Número de Casa
                </label>
                <input
                  type='text'
                  name='nro'
                  value={formData.nro}
                  onChange={handleInputChange}
                  required
                  className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none'
                  placeholder='Ej: 101'
                />
              </div>

              <div>
                <label className='mb-1 block text-sm font-medium text-gray-700'>Categoría</label>
                <select
                  name='categoria'
                  value={formData.categoria}
                  onChange={handleInputChange}
                  required
                  className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none'
                >
                  <option value=''>Seleccionar categoría</option>
                  <option value='Estandar'>Estandar</option>
                  <option value='Premium'>Premium</option>
                  <option value='VIP'>VIP</option>
                </select>
              </div>

              <div>
                <label className='mb-1 block text-sm font-medium text-gray-700'>Capacidad</label>
                <input
                  type='number'
                  name='capacidad'
                  value={formData.capacidad}
                  onChange={handleInputChange}
                  required
                  min='1'
                  className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none'
                  placeholder='Ej: 5'
                />
              </div>
            </div>

            <div className='flex space-x-3'>
              <button
                type='submit'
                disabled={loading}
                className='rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:bg-gray-400'
              >
                {loading ? 'Guardando...' : 'Guardar Casa'}
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

      {/* Lista de casas */}
      <div className='overflow-hidden rounded-lg bg-white shadow'>
        <div className='border-b border-gray-200 px-6 py-4'>
          <h2 className='text-lg font-semibold'>Lista de Casas/Departamentos</h2>
        </div>

        {loading ? (
          <div className='p-6 text-center'>
            <div className='inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-green-600'></div>
            <p className='mt-2 text-gray-600'>Cargando casas...</p>
          </div>
        ) : casas.length === 0 ? (
          <div className='p-6 text-center text-gray-500'>No hay casas registradas</div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                    Número
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                    Categoría
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                    Capacidad
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                    Residentes
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200 bg-white'>
                {casas.map((casa) => (
                  <tr key={casa.id} className='hover:bg-gray-50'>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm font-medium text-gray-900'>{casa.nro}</div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                          casa.categoria === 'Premium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : casa.categoria === 'VIP'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {casa.categoria}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-900'>{casa.capacidad} personas</div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-500'>
                        {casa.usuarios_count || 0} residentes
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
      <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
        <div className='rounded-lg bg-white p-4 shadow'>
          <div className='flex items-center'>
            <div className='rounded-full bg-green-100 p-3'>
              <span className='text-xl text-green-600'>🏠</span>
            </div>
            <div className='ml-4'>
              <p className='text-sm text-gray-600'>Total Casas</p>
              <p className='text-2xl font-bold'>{casas.length}</p>
            </div>
          </div>
        </div>

        <div className='rounded-lg bg-white p-4 shadow'>
          <div className='flex items-center'>
            <div className='rounded-full bg-blue-100 p-3'>
              <span className='text-xl text-blue-600'>👥</span>
            </div>
            <div className='ml-4'>
              <p className='text-sm text-gray-600'>Capacidad Total</p>
              <p className='text-2xl font-bold'>
                {casas.reduce((total, casa) => total + casa.capacidad, 0)} personas
              </p>
            </div>
          </div>
        </div>

        <div className='rounded-lg bg-white p-4 shadow'>
          <div className='flex items-center'>
            <div className='rounded-full bg-amber-100 p-3'>
              <span className='text-xl text-amber-600'>⭐</span>
            </div>
            <div className='ml-4'>
              <p className='text-sm text-gray-600'>Casas Premium</p>
              <p className='text-2xl font-bold'>
                {casas.filter((casa) => casa.categoria === 'Premium').length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
