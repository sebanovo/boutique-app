import { useState } from 'react';
import { SYSTEM_NAME } from '../constants/index';
import Icon from './Icon';

function Sidebar({ activeSection, setActiveSection }) {
  const [openSections, setOpenSections] = useState({
    propiedades: true,
    servicios: false,
    seguridad: false,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const menuItems = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: <Icon name='dashboard' />,
    },
    {
      id: 'administracion',
      name: 'Administración',
      icon: <Icon name='admin' />,
      children: [{ id: 'roles', name: 'Roles y Permisos', icon: <Icon name='roles' /> }],
    },
    {
      id: 'propiedades',
      name: 'Gestión de Propiedades',
      icon: <Icon name='dashboard' />,
      children: [
        { id: 'casas', name: 'Casas', icon: <Icon name='house' /> },
        { id: 'vehiculos', name: 'Vehículos', icon: <Icon name='vehicule' /> },
        { id: 'residentes', name: 'Residentes', icon: <Icon name='resident' /> },
      ],
    },
    {
      id: 'servicios',
      name: 'Servicios Comunes',
      icon: <Icon name='dashboard' />,
      children: [
        { id: 'areas-comunes', name: 'Áreas Comunes', icon: <Icon name='swimming' /> },
        { id: 'reservas', name: 'Reservas', icon: <Icon name='calendar' /> },
        { id: 'multas', name: 'Multas', icon: <Icon name='fines' /> },
      ],
    },
    {
      id: 'seguridad',
      name: 'Control de Acceso',
      icon: <Icon name='dashboard' />,
      children: [
        { id: 'ingresos-salidas', name: 'Ingresos y Salidas', icon: <Icon name='accesible' /> },
        { id: 'extranjeros', name: 'Visitantes Extranjeros', icon: <Icon name='foraigner' /> },
      ],
    },
  ];

  return (
    <div className='flex w-64 flex-col bg-green-800 text-white'>
      <div className='flex items-center gap-2 p-4'>
        <img className='w-12 rounded-2xl' src='images/logo.png'></img>
        <span className='text-xl font-bold'>{SYSTEM_NAME}</span>
      </div>

      <nav className='flex-1 overflow-y-auto pt-2'>
        <ul className='space-y-1 px-2'>
          {menuItems.map((item) => (
            <li key={item.id}>
              {item.children ? (
                <>
                  <button
                    onClick={() => toggleSection(item.id)}
                    className={`flex w-full items-center justify-between rounded-lg p-3 transition hover:bg-green-700 ${
                      openSections[item.id] ? 'bg-green-700' : ''
                    }`}
                  >
                    <div className='flex items-center'>
                      <span className='mr-3 flex h-5 w-5 items-center justify-center'>
                        {item.icon}
                      </span>
                      <span>{item.name}</span>
                    </div>
                    <span
                      className={`transition-transform ${openSections[item.id] ? 'rotate-180 transform' : ''}`}
                    >
                      ▼
                    </span>
                  </button>

                  {openSections[item.id] && (
                    <ul className='mt-1 ml-6 space-y-1'>
                      {item.children.map((child) => (
                        <li key={child.id}>
                          <button
                            onClick={() => setActiveSection(child.id)}
                            className={`flex w-full items-center rounded-lg p-2 pl-8 text-left transition hover:bg-green-700 ${
                              activeSection === child.id ? 'bg-green-600' : ''
                            }`}
                          >
                            <span className='mr-3 flex h-4 w-4 items-center justify-center opacity-75'>
                              {child.icon}
                            </span>
                            {child.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <button
                  onClick={() => setActiveSection(item.id)}
                  className={`flex w-full items-center rounded-lg p-3 transition hover:bg-green-700 ${
                    activeSection === item.id ? 'bg-green-600' : ''
                  }`}
                >
                  <span className='mr-3 flex h-5 w-5 items-center justify-center'>{item.icon}</span>
                  <span>{item.name}</span>
                </button>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;
