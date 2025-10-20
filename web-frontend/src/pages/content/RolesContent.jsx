import { useState, useEffect } from 'react';
import { server } from '../../utils/server';

export default function RolesContent() {
  const [usuarios, setUsuarios] = useState([]);
  const [groups, setGroups] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showGroupForm, setShowGroupForm] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersData, groupsData, permsData] = await Promise.all([
        server().getUsuarios(),
        server().getGroups(),
        server().getPermissions(),
      ]);
      setUsuarios(usersData);
      setGroups(groupsData);
      setPermissions(permsData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      setError('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignGroups = async (user, groupIds) => {
    try {
      await server().assignUserGroups(user.id, groupIds);
      // Actualizar el usuario localmente sin recargar toda la lista
      const updatedUsers = usuarios.map((u) =>
        u.id === user.id ? { ...u, groups: groups.filter((g) => groupIds.includes(g.id)) } : u
      );
      setUsuarios(updatedUsers);
      setSelectedUser({ ...user, groups: groups.filter((g) => groupIds.includes(g.id)) });
    } catch (error) {
      console.error('Error al asignar grupos:', error);
      setError('Error al asignar roles al usuario');
    }
  };

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) return;

    try {
      const newGroup = await server().createGroup(newGroupName);
      setGroups((prev) => [...prev, newGroup]);
      setNewGroupName('');
      setShowGroupForm(false);
    } catch (error) {
      console.error('Error al crear grupo:', error);
      setError('Error al crear el grupo');
    }
  };

  if (loading) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <div className='h-12 w-12 animate-spin rounded-full border-b-2 border-green-600'></div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-bold text-gray-900'>Gestión de Roles y Permisos</h1>
        <button
          onClick={() => setShowGroupForm(!showGroupForm)}
          className='rounded-lg bg-green-600 px-4 py-2 text-white transition hover:bg-green-700'
        >
          {showGroupForm ? 'Cancelar' : '➕ Crear Rol'}
        </button>
      </div>

      {error && (
        <div className='rounded border border-red-200 bg-red-50 px-4 py-3 text-red-700'>
          {error}
        </div>
      )}

      {/* Formulario para crear grupo */}
      {showGroupForm && (
        <div className='rounded-lg bg-white p-6 shadow'>
          <h2 className='mb-4 text-xl font-semibold'>Crear Nuevo Rol</h2>
          <div className='flex space-x-3'>
            <input
              type='text'
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              placeholder='Nombre del rol (ej: Administrador, Residente, Guardia)'
              className='flex-1 rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none'
            />
            <button
              onClick={handleCreateGroup}
              className='rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700'
            >
              Crear
            </button>
          </div>
        </div>
      )}

      {/* Estadísticas rápidas */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
        <div className='rounded-lg bg-white p-4 shadow'>
          <div className='flex items-center'>
            <div className='rounded-full bg-green-100 p-3'>
              <span className='text-xl text-green-600'>👥</span>
            </div>
            <div className='ml-4'>
              <p className='text-sm text-gray-600'>Total Usuarios</p>
              <p className='text-2xl font-bold'>{usuarios.length}</p>
            </div>
          </div>
        </div>

        <div className='rounded-lg bg-white p-4 shadow'>
          <div className='flex items-center'>
            <div className='rounded-full bg-blue-100 p-3'>
              <span className='text-xl text-blue-600'>🎭</span>
            </div>
            <div className='ml-4'>
              <p className='text-sm text-gray-600'>Roles Disponibles</p>
              <p className='text-2xl font-bold'>{groups.length}</p>
            </div>
          </div>
        </div>

        <div className='rounded-lg bg-white p-4 shadow'>
          <div className='flex items-center'>
            <div className='rounded-full bg-purple-100 p-3'>
              <span className='text-xl text-purple-600'>🔐</span>
            </div>
            <div className='ml-4'>
              <p className='text-sm text-gray-600'>Permisos</p>
              <p className='text-2xl font-bold'>{permissions.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de usuarios con roles */}
      <div className='overflow-hidden rounded-lg bg-white shadow'>
        <div className='border-b border-gray-200 px-6 py-4'>
          <h2 className='text-lg font-semibold'>Usuarios y sus Roles</h2>
        </div>

        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                  Usuario
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                  Email
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                  Roles Asignados
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200 bg-white'>
              {usuarios.map((usuario) => (
                <tr key={usuario.id} className='hover:bg-gray-50'>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='flex items-center'>
                      {usuario.photo_url ? (
                        <img
                          className='h-10 w-10 rounded-full object-cover'
                          src={usuario.photo_url}
                          alt={usuario.username}
                        />
                      ) : (
                        <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gray-300'>
                          <span className='font-medium text-gray-600'>
                            {usuario.username?.charAt(0) || 'U'}
                          </span>
                        </div>
                      )}
                      <div className='ml-4'>
                        <div className='text-sm font-medium text-gray-900'>
                          {usuario.username || 'Sin nombre'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm text-gray-900'>{usuario.email}</div>
                  </td>
                  <td className='px-6 py-4'>
                    <div className='flex flex-wrap gap-1'>
                      {usuario.groups && usuario.groups.length > 0 ? (
                        usuario.groups.map((group) => (
                          <span
                            key={group.id}
                            className='inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800'
                          >
                            {group.name}
                          </span>
                        ))
                      ) : (
                        <span className='text-sm text-gray-500'>Sin roles asignados</span>
                      )}
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <button
                      onClick={() => setSelectedUser(usuario)}
                      className='text-sm font-medium text-green-600 hover:text-green-900'
                    >
                      Gestionar Roles
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para asignar roles a usuario */}
      {selectedUser && (
        <div className='bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4'>
          <div className='w-full max-w-md overflow-y-auto rounded-lg bg-white shadow-xl'>
            <div className='p-6'>
              <h3 className='mb-4 text-lg font-semibold'>
                Asignar Roles a: {selectedUser.username || selectedUser.email}
              </h3>

              <div className='mb-6 space-y-3'>
                {groups.map((group) => (
                  <label key={group.id} className='flex items-center'>
                    <input
                      type='checkbox'
                      checked={selectedUser.groups?.some((g) => g.id === group.id) || false}
                      onChange={(e) => {
                        const currentGroupIds = selectedUser.groups?.map((g) => g.id) || [];
                        let newGroupIds;

                        if (e.target.checked) {
                          newGroupIds = [...currentGroupIds, group.id];
                        } else {
                          newGroupIds = currentGroupIds.filter((id) => id !== group.id);
                        }

                        handleAssignGroups(selectedUser, newGroupIds);
                      }}
                      className='rounded border-gray-300 text-green-600 focus:ring-green-500'
                    />
                    <span className='ml-2 text-sm text-gray-700'>{group.name}</span>
                  </label>
                ))}
              </div>

              <div className='flex space-x-3'>
                <button
                  onClick={() => setSelectedUser(null)}
                  className='flex-1 rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600'
                >
                  Cerrar
                </button>
                <button
                  onClick={() => {
                    handleAssignGroups(selectedUser, []);
                    setSelectedUser(null);
                  }}
                  className='flex-1 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700'
                >
                  Quitar Todos
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lista de grupos y permisos */}
      <div className='overflow-hidden rounded-lg bg-white shadow'>
        <div className='border-b border-gray-200 px-6 py-4'>
          <h2 className='text-lg font-semibold'>Roles Disponibles</h2>
        </div>

        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                  Rol
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                  Usuarios Asignados
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                  Descripción
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200 bg-white'>
              {groups.map((group) => {
                const userCount = usuarios.filter((user) =>
                  user.groups?.some((g) => g.id === group.id)
                ).length;

                return (
                  <tr key={group.id} className='hover:bg-gray-50'>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm font-medium text-gray-900'>{group.name}</div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-900'>
                        {userCount} usuario{userCount !== 1 ? 's' : ''}
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      <div className='text-sm text-gray-500'>
                        {group.name === 'Administrador' && 'Acceso completo al sistema'}
                        {group.name === 'Residente' && 'Acceso limitado a funciones de residente'}
                        {group.name === 'Guardia' && 'Acceso a control de ingresos/salidas'}
                        {!['Administrador', 'Residente', 'Guardia'].includes(group.name) &&
                          'Rol personalizado'}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
