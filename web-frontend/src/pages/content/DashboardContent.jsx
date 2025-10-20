import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { server } from '../../utils/server';

export default function DashboardContent() {
  const [stats, setStats] = useState({
    totalResidentes: 0,
    totalCasas: 0,
    reservasHoy: 0,
    multasPendientes: 0,
  });
  const [actividadReciente, setActividadReciente] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Obtener datos de diferentes endpoints
      const [residentesData, casasData, reservasData, multasData, ingresosData] = await Promise.all(
        [
          server().getUsuarios(),
          server().getCasas(),
          server().getReservas(),
          server().getMultas(),
          server().getIngresosSalidas(), // Asumiendo que tienes este endpoint
        ]
      );

      // Calcular estadísticas
      const hoy = new Date().toISOString().split('T')[0];
      const reservasHoy = reservasData.filter((reserva) => reserva.fecha.startsWith(hoy)).length;

      const multasPendientes = multasData.filter(
        (multa) => multa.estado_pago === 'pendiente'
      ).length;

      // Obtener actividad reciente (últimos 5 ingresos/salidas)
      const actividad = ingresosData.slice(0, 5).map((ingreso) => ({
        tipo: ingreso.tipo,
        modo: ingreso.modo,
        usuario: ingreso.usuario?.username || 'Visitante',
        fecha: ingreso.fecha,
        esExtranjero: ingreso.es_extranjero,
      }));

      setStats({
        totalResidentes: residentesData.length,
        totalCasas: casasData.length,
        reservasHoy,
        multasPendientes,
      });

      setActividadReciente(actividad);
    } catch (error) {
      console.error('Error al cargar datos del dashboard:', error);
      setError('Error al cargar los datos del dashboard');
    } finally {
      setLoading(false);
    }
  };

  const formatFechaRelativa = (fechaString) => {
    const fecha = new Date(fechaString);
    const ahora = new Date();
    const diffMs = ahora - fecha;
    const diffMin = Math.floor(diffMs / 60000);
    const diffHoras = Math.floor(diffMin / 60);
    const diffDias = Math.floor(diffHoras / 24);

    if (diffMin < 1) return 'Hace unos segundos';
    if (diffMin < 60) return `Hace ${diffMin} min`;
    if (diffHoras < 24) return `Hace ${diffHoras} horas`;
    return `Hace ${diffDias} días`;
  };

  const getDescripcionActividad = (actividad) => {
    const modos = {
      auto: 'en auto',
      moto: 'en moto',
      bici: 'en bicicleta',
      pie: 'a pie',
      otro: '',
    };

    const tipo = actividad.tipo === 'ingreso' ? 'ingresó' : 'salió';
    const modo = modos[actividad.modo] || '';
    const extranjero = actividad.esExtranjero ? ' (visitante)' : '';

    return `${actividad.usuario} ${tipo} ${modo}${extranjero}`;
  };

  if (loading) {
    return (
      <div className='space-y-6'>
        <h1 className='text-3xl font-bold text-gray-900'>Dashboard del boutique</h1>
        <div className='flex h-64 items-center justify-center'>
          <div className='h-12 w-12 animate-spin rounded-full border-b-2 border-green-600'></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='space-y-6'>
        <h1 className='text-3xl font-bold text-gray-900'>Dashboard del boutique</h1>
        <div className='rounded border border-red-200 bg-red-50 px-4 py-3 text-red-700'>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <h1 className='text-3xl font-bold text-gray-900'>Dashboard del boutique</h1>

      {/* Estadísticas */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
        <div className='rounded-lg bg-white p-6 shadow'>
          <div className='flex items-center'>
            <div className='rounded-full bg-green-100 p-3'>
              <span className='text-2xl'>👥</span>
            </div>
            <div className='ml-4'>
              <p className='text-sm font-medium text-gray-600'>Total Residentes</p>
              <p className='text-2xl font-bold text-gray-900'>{stats.totalResidentes}</p>
            </div>
          </div>
        </div>

        <div className='rounded-lg bg-white p-6 shadow'>
          <div className='flex items-center'>
            <div className='rounded-full bg-blue-100 p-3'>
              <span className='text-2xl'>🏠</span>
            </div>
            <div className='ml-4'>
              <p className='text-sm font-medium text-gray-600'>Total Casas</p>
              <p className='text-2xl font-bold text-gray-900'>{stats.totalCasas}</p>
            </div>
          </div>
        </div>

        <div className='rounded-lg bg-white p-6 shadow'>
          <div className='flex items-center'>
            <div className='rounded-full bg-amber-100 p-3'>
              <span className='text-2xl'>📅</span>
            </div>
            <div className='ml-4'>
              <p className='text-sm font-medium text-gray-600'>Reservas Hoy</p>
              <p className='text-2xl font-bold text-gray-900'>{stats.reservasHoy}</p>
            </div>
          </div>
        </div>

        <div className='rounded-lg bg-white p-6 shadow'>
          <div className='flex items-center'>
            <div className='rounded-full bg-red-100 p-3'>
              <span className='text-2xl'>⚠️</span>
            </div>
            <div className='ml-4'>
              <p className='text-sm font-medium text-gray-600'>Multas Pendientes</p>
              <p className='text-2xl font-bold text-gray-900'>{stats.multasPendientes}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Secciones rápidas */}
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
        <div className='rounded-lg bg-white p-6 shadow'>
          <h2 className='mb-4 text-xl font-semibold'>Actividad Reciente</h2>
          <div className='space-y-3'>
            {actividadReciente.length > 0 ? (
              actividadReciente.map((actividad, index) => (
                <div key={index} className='flex items-center justify-between border-b pb-2'>
                  <span className='text-sm'>{getDescripcionActividad(actividad)}</span>
                  <span className='text-xs text-gray-500'>
                    {formatFechaRelativa(actividad.fecha)}
                  </span>
                </div>
              ))
            ) : (
              <div className='py-4 text-center text-gray-500'>No hay actividad reciente</div>
            )}
          </div>
        </div>
      </div>

      {/* Información adicional */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        <div className='rounded-lg bg-white p-6 shadow'>
          <h2 className='mb-4 text-xl font-semibold'>Resumen del Día</h2>
          <div className='space-y-2 text-sm'>
            <div className='flex justify-between'>
              <span>Residentes activos:</span>
              <span className='font-semibold'>{stats.totalResidentes}</span>
            </div>
            <div className='flex justify-between'>
              <span>Reservas programadas:</span>
              <span className='font-semibold'>{stats.reservasHoy}</span>
            </div>
            <div className='flex justify-between'>
              <span>Multas por cobrar:</span>
              <span className='font-semibold text-red-600'>{stats.multasPendientes}</span>
            </div>
          </div>
        </div>

        <div className='rounded-lg bg-white p-6 shadow'>
          <h2 className='mb-4 text-xl font-semibold'>Estado del Sistema</h2>
          <div className='space-y-2 text-sm'>
            <div className='flex items-center justify-between'>
              <span>API Backend:</span>
              <span className='inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800'>
                Conectado
              </span>
            </div>
            <div className='flex justify-between'>
              <span>Última actualización:</span>
              <span className='font-semibold'>{new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
