import { useState, useEffect } from 'react';
import { server } from '../../utils/server';

export default function VehiculosContent() {
  const [vehiculos, setVehiculos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  // Estado para el formulario
  const [formData, setFormData] = useState({
    placa: '',
    tipo: '',
    color: '',
    id_usuario: '',
  });

  // Cargar vehículos y usuarios al montar el componente
  useEffect(() => {
    fetchVehiculos();
    fetchUsuarios();
  }, []);

  const fetchVehiculos = async () => {
    setLoading(true);
    try {
      const response = await server().getVehiculos();
      setVehiculos(response);
      setError('');
    } catch (error) {
      console.error('Error al cargar vehículos:', error);
      setError('Error al cargar los vehículos');
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
      await server().createVehiculo({
        placa: formData.placa.toUpperCase(),
        tipo: formData.tipo,
        color: formData.color,
        id_usuario: parseInt(formData.id_usuario),
      });

      // Limpiar formulario y recargar lista
      setFormData({ placa: '', tipo: '', color: '', id_usuario: '' });
      setShowForm(false);
      await fetchVehiculos(); // Recargar la lista
    } catch (error) {
      console.error('Error al crear vehículo:', error);
      setError('Error al crear el vehículo');
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

  const getTipoColor = (tipo) => {
    const colors = {
      auto: 'bg-blue-100 text-blue-800',
      moto: 'bg-orange-100 text-orange-800',
      bicicleta: 'bg-green-100 text-green-800',
      camioneta: 'bg-purple-100 text-purple-800',
      otro: 'bg-gray-100 text-gray-800',
    };
    return colors[tipo] || colors['otro'];
  };

  const getUsuarioNombre = (idUsuario) => {
    const usuario = usuarios.find((u) => u.id === idUsuario);
    return usuario ? `${usuario.username} (${usuario.email})` : 'Usuario no encontrado';
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-bold text-gray-900'>Gestión de Vehículos</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className='rounded-lg bg-green-600 px-4 py-2 text-white transition hover:bg-green-700'
        >
          {showForm ? 'Cancelar' : '🚗 Agregar Vehículo'}
        </button>
      </div>

      {error && (
        <div className='rounded border border-red-200 bg-red-50 px-4 py-3 text-red-700'>
          {error}
        </div>
      )}

      {/* Formulario para agregar vehículo */}
      {showForm && (
        <div className='rounded-lg bg-white p-6 shadow'>
          <h2 className='mb-4 text-xl font-semibold'>Registrar Nuevo Vehículo</h2>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div>
                <label className='mb-1 block text-sm font-medium text-gray-700'>Placa *</label>
                <input
                  type='text'
                  name='placa'
                  value={formData.placa}
                  onChange={handleInputChange}
                  required
                  className='w-full rounded-md border border-gray-300 px-3 py-2 uppercase focus:ring-2 focus:ring-green-500 focus:outline-none'
                  placeholder='Ej: 5722AGDA'
                  maxLength={10}
                />
              </div>

              <div>
                <label className='mb-1 block text-sm font-medium text-gray-700'>
                  Tipo de Vehículo *
                </label>
                <select
                  name='tipo'
                  value={formData.tipo}
                  onChange={handleInputChange}
                  required
                  className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none'
                >
                  <option value=''>Seleccionar tipo</option>
                  <option value='auto'>Auto</option>
                  <option value='moto'>Moto</option>
                  <option value='bicicleta'>Bicicleta</option>
                  <option value='camioneta'>Camioneta</option>
                  <option value='otro'>Otro</option>
                </select>
              </div>

              <div>
                <label className='mb-1 block text-sm font-medium text-gray-700'>Color *</label>
                <input
                  type='text'
                  name='color'
                  value={formData.color}
                  onChange={handleInputChange}
                  required
                  className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none'
                  placeholder='Ej: negro, blanco, rojo'
                />
              </div>

              <div>
                <label className='mb-1 block text-sm font-medium text-gray-700'>
                  Propietario *
                </label>
                <select
                  name='id_usuario'
                  value={formData.id_usuario}
                  onChange={handleInputChange}
                  required
                  className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none'
                >
                  <option value=''>Seleccionar propietario</option>
                  {usuarios.map((usuario) => (
                    <option key={usuario.id} value={usuario.id}>
                      {usuario.username} - {usuario.email}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className='flex space-x-3'>
              <button
                type='submit'
                disabled={loading}
                className='rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:bg-gray-400'
              >
                {loading ? 'Guardando...' : 'Registrar Vehículo'}
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

      {/* Lista de vehículos */}
      <div className='overflow-hidden rounded-lg bg-white shadow'>
        <div className='border-b border-gray-200 px-6 py-4'>
          <h2 className='text-lg font-semibold'>Vehículos Registrados</h2>
        </div>

        {loading ? (
          <div className='p-6 text-center'>
            <div className='inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-green-600'></div>
            <p className='mt-2 text-gray-600'>Cargando vehículos...</p>
          </div>
        ) : vehiculos.length === 0 ? (
          <div className='p-6 text-center text-gray-500'>No hay vehículos registrados</div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                    Placa
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                    Tipo
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                    Color
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                    Propietario
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                    Email
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200 bg-white'>
                {vehiculos.map((vehiculo) => (
                  <tr key={vehiculo.id} className='hover:bg-gray-50'>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='font-mono text-sm font-bold text-gray-900'>
                        {vehiculo.placa}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getTipoColor(vehiculo.tipo)}`}
                      >
                        {vehiculo.tipo}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex items-center'>
                        <div
                          className='mr-2 h-4 w-4 rounded-full border border-gray-300'
                          style={{ backgroundColor: vehiculo.color.toLowerCase() }}
                        ></div>
                        <span className='text-sm font-medium text-gray-900 capitalize'>
                          {vehiculo.color}
                        </span>
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-900'>
                        {vehiculo.usuario?.username || getUsuarioNombre(vehiculo.id_usuario)}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-500'>
                        {vehiculo.usuario?.email || 'N/A'}
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
              <span className='text-xl text-green-600'>🚗</span>
            </div>
            <div className='ml-4'>
              <p className='text-sm text-gray-600'>Total Vehículos</p>
              <p className='text-2xl font-bold'>{vehiculos.length}</p>
            </div>
          </div>
        </div>

        <div className='rounded-lg bg-white p-4 shadow'>
          <div className='flex items-center'>
            <div className='rounded-full bg-blue-100 p-3'>
              <span className='text-xl text-blue-600'>🚙</span>
            </div>
            <div className='ml-4'>
              <p className='text-sm text-gray-600'>Autos</p>
              <p className='text-2xl font-bold'>
                {vehiculos.filter((v) => v.tipo === 'auto').length}
              </p>
            </div>
          </div>
        </div>

        <div className='rounded-lg bg-white p-4 shadow'>
          <div className='flex items-center'>
            <div className='rounded-full bg-orange-100 p-3'>
              <span className='text-xl text-orange-600'>🏍️</span>
            </div>
            <div className='ml-4'>
              <p className='text-sm text-gray-600'>Motos</p>
              <p className='text-2xl font-bold'>
                {vehiculos.filter((v) => v.tipo === 'moto').length}
              </p>
            </div>
          </div>
        </div>

        <div className='rounded-lg bg-white p-4 shadow'>
          <div className='flex items-center'>
            <div className='rounded-full bg-purple-100 p-3'>
              <span className='text-xl text-purple-600'>🚲</span>
            </div>
            <div className='ml-4'>
              <p className='text-sm text-gray-600'>Bicicletas</p>
              <p className='text-2xl font-bold'>
                {vehiculos.filter((v) => v.tipo === 'bicicleta').length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
