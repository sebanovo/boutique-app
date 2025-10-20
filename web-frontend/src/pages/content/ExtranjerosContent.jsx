import { useState, useEffect } from 'react';
import { server } from '../../utils/server';

export default function ExtranjerosContent() {
  const [extranjeros, setExtranjeros] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  // Estado para el formulario
  const [formData, setFormData] = useState({
    ci: '',
    nombre: '',
  });

  // Cargar extranjeros al montar el componente
  useEffect(() => {
    fetchExtranjeros();
  }, []);

  const fetchExtranjeros = async () => {
    setLoading(true);
    try {
      const response = await server().getExtranjeros();
      setExtranjeros(response);
      setError('');
    } catch (error) {
      console.error('Error al cargar extranjeros:', error);
      setError('Error al cargar los visitantes extranjeros');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await server().createExtranjero({
        ci: formData.ci.toString(),
        nombre: formData.nombre,
      });

      // Limpiar formulario y recargar lista
      setFormData({ ci: '', nombre: '' });
      setShowForm(false);
      await fetchExtranjeros();
    } catch (error) {
      console.error('Error al crear extranjero:', error);
      setError('Error al crear el visitante extranjero');
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
        <h1 className='text-3xl font-bold text-gray-900'>Gestión de Visitantes Extranjeros</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className='rounded-lg bg-green-600 px-4 py-2 text-white transition hover:bg-green-700'
        >
          {showForm ? 'Cancelar' : '🌎 Agregar Extranjero'}
        </button>
      </div>

      {error && (
        <div className='rounded border border-red-200 bg-red-50 px-4 py-3 text-red-700'>
          {error}
        </div>
      )}

      {/* Formulario para agregar extranjero */}
      {showForm && (
        <div className='rounded-lg border bg-white p-6 shadow'>
          <h2 className='mb-4 text-xl font-semibold'>Registrar Visitante Extranjero</h2>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div>
                <label className='mb-1 block text-sm font-medium text-gray-700'>
                  Número de CI/Pasaporte *
                </label>
                <input
                  type='text'
                  name='ci'
                  value={formData.ci}
                  onChange={handleInputChange}
                  required
                  className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none'
                  placeholder='Ej: 1237474'
                />
              </div>

              <div>
                <label className='mb-1 block text-sm font-medium text-gray-700'>
                  Nombre Completo *
                </label>
                <input
                  type='text'
                  name='nombre'
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required
                  className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none'
                  placeholder='Ej: Diego Armando Maradona'
                />
              </div>
            </div>

            <div className='flex space-x-3'>
              <button
                type='submit'
                disabled={loading}
                className='rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:bg-gray-400'
              >
                {loading ? 'Registrando...' : 'Registrar Visitante'}
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

      {/* Estadística simple */}
      <div className='rounded-lg bg-white p-4 shadow'>
        <div className='flex items-center'>
          <div className='rounded-full bg-green-100 p-3'>
            <span className='text-xl text-green-600'>🌎</span>
          </div>
          <div className='ml-4'>
            <p className='text-sm text-gray-600'>Total de Visitantes Extranjeros Registrados</p>
            <p className='text-2xl font-bold'>{extranjeros.length}</p>
          </div>
        </div>
      </div>

      {/* Lista de extranjeros */}
      <div className='overflow-hidden rounded-lg bg-white shadow'>
        <div className='border-b border-gray-200 px-6 py-4'>
          <h2 className='text-lg font-semibold'>Visitantes Extranjeros Registrados</h2>
        </div>

        {loading ? (
          <div className='p-6 text-center'>
            <div className='inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-green-600'></div>
            <p className='mt-2 text-gray-600'>Cargando visitantes...</p>
          </div>
        ) : extranjeros.length === 0 ? (
          <div className='p-6 text-center text-gray-500'>
            No hay visitantes extranjeros registrados
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                    CI/Pasaporte
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                    Nombre Completo
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200 bg-white'>
                {extranjeros.map((extranjero) => (
                  <tr key={extranjero.id} className='hover:bg-gray-50'>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='font-mono text-sm font-medium text-gray-900'>
                        {extranjero.ci}
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      <div className='text-sm font-semibold text-gray-900'>{extranjero.nombre}</div>
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
