import { useState, useEffect } from 'react';
import { server } from '../../utils/server';

export default function ResidentesContent() {
  const [residentes, setResidentes] = useState([]);
  const [casas, setCasas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  // Estado para el formulario
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    photo: '',
    casa_id: '',
  });

  // Cargar residentes y casas al montar el componente
  useEffect(() => {
    fetchResidentes();
    fetchCasas();
  }, []);

  const fetchResidentes = async () => {
    setLoading(true);
    try {
      const response = await server().getResidentes();
      setResidentes(response);
      setError('');
    } catch (error) {
      console.error('Error al cargar residentes:', error);
      setError('Error al cargar los residentes');
    } finally {
      setLoading(false);
    }
  };

  const fetchCasas = async () => {
    try {
      const response = await server().getCasas();
      setCasas(response);
    } catch (error) {
      console.error('Error al cargar casas:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await server().createResidente({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        photo: formData.photo || null,
        casa_id: formData.casa_id ? parseInt(formData.casa_id) : null,
      });

      // Limpiar formulario y recargar lista
      setFormData({
        username: '',
        email: '',
        password: '',
        photo: '',
        casa_id: '',
      });
      setShowForm(false);
      await fetchResidentes(); // Recargar la lista
    } catch (error) {
      console.error('Error al crear residente:', error);
      setError('Error al crear el residente');
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

  // const getCasaNumero = (casaId) => {
  //   const casa = casas.find((c) => c.id === casaId);
  //   return casa ? casa.nro : 'Sin casa asignada';
  // };

  const getResidentesPorCasa = (casaId) => {
    return residentes.filter(
      (residente) => residente.casas && residente.casas.some((casa) => casa.id === casaId)
    ).length;
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-bold text-gray-900'>Gestión de Residentes</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className='rounded-lg bg-green-600 px-4 py-2 text-white transition hover:bg-green-700'
        >
          {showForm ? 'Cancelar' : '👥 Agregar Residente'}
        </button>
      </div>

      {error && (
        <div className='rounded border border-red-200 bg-red-50 px-4 py-3 text-red-700'>
          {error}
        </div>
      )}

      {/* Formulario para agregar residente */}
      {showForm && (
        <div className='rounded-lg bg-white p-6 shadow'>
          <h2 className='mb-4 text-xl font-semibold'>Registrar Nuevo Residente</h2>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div>
                <label className='mb-1 block text-sm font-medium text-gray-700'>
                  Nombre Completo *
                </label>
                <input
                  type='text'
                  name='username'
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none'
                  placeholder='Ej: Juan Pérez'
                />
              </div>

              <div>
                <label className='mb-1 block text-sm font-medium text-gray-700'>Email *</label>
                <input
                  type='email'
                  name='email'
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none'
                  placeholder='Ej: juan@email.com'
                />
              </div>

              <div>
                <label className='mb-1 block text-sm font-medium text-gray-700'>Contraseña *</label>
                <input
                  type='password'
                  name='password'
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none'
                  placeholder='Contraseña segura'
                />
              </div>

              <div>
                <label className='mb-1 block text-sm font-medium text-gray-700'>
                  Casa/Departamento
                </label>
                <select
                  name='casa_id'
                  value={formData.casa_id}
                  onChange={handleInputChange}
                  className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none'
                >
                  <option value=''>Sin asignar</option>
                  {casas.map((casa) => (
                    <option key={casa.id} value={casa.id}>
                      Casa {casa.nro} - {casa.categoria} ({getResidentesPorCasa(casa.id)}/
                      {casa.capacidad})
                    </option>
                  ))}
                </select>
              </div>

              <div className='md:col-span-2'>
                <label className='mb-1 block text-sm font-medium text-gray-700'>
                  Foto URL (Opcional)
                </label>
                <input
                  type='url'
                  name='photo'
                  value={formData.photo}
                  onChange={handleInputChange}
                  className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none'
                  placeholder='Ej: https://ejemplo.com/foto.jpg'
                />
              </div>
            </div>

            <div className='flex space-x-3'>
              <button
                type='submit'
                disabled={loading}
                className='rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:bg-gray-400'
              >
                {loading ? 'Registrando...' : 'Registrar Residente'}
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
              <span className='text-xl text-green-600'>👥</span>
            </div>
            <div className='ml-4'>
              <p className='text-sm text-gray-600'>Total Residentes</p>
              <p className='text-2xl font-bold'>{residentes.length}</p>
            </div>
          </div>
        </div>

        <div className='rounded-lg bg-white p-4 shadow'>
          <div className='flex items-center'>
            <div className='rounded-full bg-blue-100 p-3'>
              <span className='text-xl text-blue-600'>🏠</span>
            </div>
            <div className='ml-4'>
              <p className='text-sm text-gray-600'>Con Casa Asignada</p>
              <p className='text-2xl font-bold'>
                {residentes.filter((r) => r.casas && r.casas.length > 0).length}
              </p>
            </div>
          </div>
        </div>

        <div className='rounded-lg bg-white p-4 shadow'>
          <div className='flex items-center'>
            <div className='rounded-full bg-amber-100 p-3'>
              <span className='text-xl text-amber-600'>🚗</span>
            </div>
            <div className='ml-4'>
              <p className='text-sm text-gray-600'>Con Vehículos</p>
              <p className='text-2xl font-bold'>
                {residentes.filter((r) => r.vehiculos && r.vehiculos.length > 0).length}
              </p>
            </div>
          </div>
        </div>

        <div className='rounded-lg bg-white p-4 shadow'>
          <div className='flex items-center'>
            <div className='rounded-full bg-purple-100 p-3'>
              <span className='text-xl text-purple-600'>📅</span>
            </div>
            <div className='ml-4'>
              <p className='text-sm text-gray-600'>Con Reservas</p>
              <p className='text-2xl font-bold'>
                {residentes.filter((r) => r.reservas && r.reservas.length > 0).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de residentes */}
      <div className='overflow-hidden rounded-lg bg-white shadow'>
        <div className='border-b border-gray-200 px-6 py-4'>
          <h2 className='text-lg font-semibold'>Residentes Registrados</h2>
        </div>

        {loading ? (
          <div className='p-6 text-center'>
            <div className='inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-green-600'></div>
            <p className='mt-2 text-gray-600'>Cargando residentes...</p>
          </div>
        ) : residentes.length === 0 ? (
          <div className='p-6 text-center text-gray-500'>No hay residentes registrados</div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                    Residente
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                    Contacto
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                    Casa
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                    Vehículos
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                    Reservas
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                    Multas
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200 bg-white'>
                {residentes.map((residente) => (
                  <tr key={residente.id} className='hover:bg-gray-50'>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex items-center'>
                        {residente.photo ? (
                          <img
                            className='h-10 w-10 rounded-full object-cover'
                            src={residente.photo}
                            alt={residente.username}
                          />
                        ) : (
                          <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gray-300'>
                            <span className='font-medium text-gray-600'>
                              {residente.username?.charAt(0) || 'U'}
                            </span>
                          </div>
                        )}
                        <div className='ml-4'>
                          <div className='text-sm font-medium text-gray-900'>
                            {residente.username}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-900'>{residente.email}</div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-900'>
                        {residente.casas && residente.casas.length > 0
                          ? residente.casas.map((casa) => `Casa ${casa.nro}`).join(', ')
                          : 'Sin asignar'}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-900'>
                        {residente.vehiculos ? residente.vehiculos.length : 0}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-900'>
                        {residente.reservas ? residente.reservas.length : 0}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-900'>
                        {residente.multas ? residente.multas.length : 0}
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
