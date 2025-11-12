import { useState, useEffect } from 'react';
import { Barra } from "../../components/BarraMenu/Barra";
import Css from './Dashboard.module.css';
import { Titulo } from '../../components/Cabesera/Titulo';

// Hook para obtener los datos del dashboard
function useDashboardData(filters) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const queryParams = new URLSearchParams();
        Object.keys(filters).forEach(key => {
          if (filters[key]) queryParams.append(key, filters[key]);
        });

        const response = await fetch(`/api/venta/dashboard/?${queryParams}`);
        if (!response.ok) throw new Error('Error en la respuesta del servidor');
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filters]);

  return { data, loading, error };
}

// Métricas principales
function Metricas({ metricas }) {
  if (!metricas) return null;

  return (
    <div className={Css.metricas}>
      <h2 className={Css.sectionTitle}><ion-icon name="speedometer-outline"></ion-icon> Métricas Principales</h2>
      <div className={Css.metricasGrid}>
        <div className={Css.metricaCard}>
          <div className={Css.metricaIcon}>
            <ion-icon name="cash-outline"></ion-icon>
          </div>
          <div className={Css.metricaContent}>
            <h3>Total Ventas</h3>
            <p>{metricas.total_ventas?.toLocaleString() || 0}</p>
          </div>
        </div>
        <div className={Css.metricaCard}>
          <div className={Css.metricaIcon}>
            <ion-icon name="trending-up-outline"></ion-icon>
          </div>
          <div className={Css.metricaContent}>
            <h3>Ingresos Totales</h3>
            <p>${metricas.total_ingresos?.toLocaleString() || 0}</p>
          </div>
        </div>
        <div className={Css.metricaCard}>
          <div className={Css.metricaIcon}>
            <ion-icon name="cube-outline"></ion-icon>
          </div>
          <div className={Css.metricaContent}>
            <h3>Productos Vendidos</h3>
            <p>{metricas.total_productos_vendidos?.toLocaleString() || 0}</p>
          </div>
        </div>
        <div className={Css.metricaCard}>
          <div className={Css.metricaIcon}>
            <ion-icon name="receipt-outline"></ion-icon>
          </div>
          <div className={Css.metricaContent}>
            <h3>Ticket Promedio</h3>
            <p>${metricas.ticket_promedio || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Gráfica de Barras - Ventas vs Productos
function GraficaBarras({ datos }) {
  if (!datos?.ventas_por_dia) return null;

  const maxValue = Math.max(
    ...datos.ventas_por_dia.map(item => item.total_ingresos || 0),
    ...datos.ventas_por_dia.map(item => item.cantidad_ventas || 0)
  );

  return (
    <div className={Css.graficaCard}>
      <h3 className={Css.cardTitle}><ion-icon name="bar-chart-outline"></ion-icon> Ventas vs Productos por Día</h3>
      <div className={Css.graficaContainer}>
        <div className={Css.barChart}>
          {datos.ventas_por_dia.slice(0, 7).map((item, index) => (
            <div key={index} className={Css.barGroup}>
              <div className={Css.barValue}>${(item.total_ingresos || 0).toLocaleString()}</div>

              <div 
                className={`${Css.bar} ${Css.barVentas}`}
                style={{ height: `${((item.total_ingresos || 0) / maxValue) * 200}px` }}
                title={`Ventas: $${(item.total_ingresos || 0).toLocaleString()}`}
              ></div>

              <div 
                className={`${Css.bar} ${Css.barProductos}`}
                style={{ height: `${((item.cantidad_ventas || 0) / maxValue) * 200}px` }}
                title={`Productos: ${item.cantidad_ventas || 0}`}
              ></div>

              <div className={Css.barLabel}>
                {new Date(item.fecha_dia).toLocaleDateString('es', { weekday: 'short' })}
              </div>
            </div>
          ))}
        </div>
        <div className={Css.leyenda}>
          <div className={Css.leyendaItem}>
            <div className={`${Css.leyendaColor} ${Css.barVentas}`}></div>
            <span>Ventas ($)</span>
          </div>
          <div className={Css.leyendaItem}>
            <div className={`${Css.leyendaColor} ${Css.barProductos}`}></div>
            <span>Productos (unidades)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Gráfica de Líneas - Tendencia
function GraficaLineas({ datos }) {
  if (!datos?.ventas_por_dia) return null;

  const ventasData = datos.ventas_por_dia.map(item => item.total_ingresos || 0);
  const productosData = datos.ventas_por_dia.map(item => item.cantidad_ventas || 0);
  const maxValue = Math.max(...ventasData, ...productosData);
  const points = ventasData.length;

  return (
    <div className={Css.graficaCard}>
      <h3 className={Css.cardTitle}><ion-icon name="stats-chart-outline"></ion-icon> Tendencia de Ventas</h3>
      <div className={Css.graficaContainer}>
        <svg width="100%" height="250" viewBox={`0 0 ${points * 50} 250`}>
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
            <line key={i} x1="0" y1={250 * ratio} x2={points * 50} y2={250 * ratio} className={Css.gridLine}/>
          ))}
          <polyline
            points={ventasData.map((value, i) => `${i * 50},${250 - (value / maxValue) * 200}`).join(' ')}
            className={`${Css.linePath} ${Css.lineVentas}`}
          />
          <polyline
            points={productosData.map((value, i) => `${i * 50},${250 - (value / maxValue) * 200}`).join(' ')}
            className={`${Css.linePath} ${Css.lineProductos}`}
          />
          {ventasData.map((value, i) => (
            <circle key={`ventas-${i}`} cx={i * 50} cy={250 - (value / maxValue) * 200} r="4" className={`${Css.dataPoint} ${Css.dataPointVentas}`}/>
          ))}
          {productosData.map((value, i) => (
            <circle key={`productos-${i}`} cx={i * 50} cy={250 - (value / maxValue) * 200} r="4" className={`${Css.dataPoint} ${Css.dataPointProductos}`}/>
          ))}
        </svg>
        <div className={Css.leyenda}>
          <div className={Css.leyendaItem}>
            <div className={`${Css.leyendaColor} ${Css.lineVentas}`}></div>
            <span>Ventas ($)</span>
          </div>
          <div className={Css.leyendaItem}>
            <div className={`${Css.leyendaColor} ${Css.lineProductos}`}></div>
            <span>Productos (unidades)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Tabla de Productos Más Vendidos
function TablaProductos({ productos }) {
  if (!productos?.length) return null;

  return (
    <div className={Css.tablaCard}>
      <h3 className={Css.cardTitle}><ion-icon name="trophy-outline"></ion-icon> Productos Más Vendidos</h3>
      <div className={Css.tablaContainer}>
        <table className={Css.dataTable}>
          <thead className={Css.tableHeader}>
            <tr>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Cantidad</th>
              <th>Ingresos</th>
            </tr>
          </thead>
          <tbody>
            {productos.slice(0, 10).map((producto, index) => (
              <tr key={index}>
                <td className={Css.textCell}>{producto.producto__nombre}</td>
                <td className={Css.textCell}>{producto.producto__categoria__nombre}</td>
                <td className={Css.textCell}>{producto.cantidad_vendida?.toLocaleString()}</td>
                <td className={Css.textCell}>${producto.ingresos_totales?.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Tabla de Ventas por Día
function TablaVentas({ ventas }) {
  if (!ventas?.length) return null;

  return (
    <div className={Css.tablaCard}>
      <h3 className={Css.cardTitle}><ion-icon name="calendar-number-outline"></ion-icon> Ventas por Día</h3>
      <div className={Css.tablaContainer}>
        <table className={Css.dataTable}>
          <thead className={Css.tableHeader}>
            <tr>
              <th>Fecha</th>
              <th>Ventas</th>
              <th>Ingresos</th>
              <th>Productos</th>
            </tr>
          </thead>
          <tbody>
            {ventas.slice(0, 10).map((venta, index) => (
              <tr key={index}>
                <td className={Css.textCell}>{new Date(venta.fecha_dia).toLocaleDateString()}</td>
                <td className={Css.textCell}>{venta.cantidad_ventas}</td>
                <td className={Css.textCell}>${venta.total_ingresos?.toLocaleString()}</td>
                <td className={Css.textCell}>{venta.total_productos}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Filtros del Dashboard
function FiltrosDashboard({ filters, onFilterChange }) {
  const handleChange = (key, value) => onFilterChange({ ...filters, [key]: value });

  return (
    <div className={Css.filtros}>
      <select value={filters.tipo} onChange={(e) => handleChange('tipo', e.target.value)} className={Css.filterSelect}>
        <option value="ventas">Ventas</option>
        <option value="productos">Productos</option>
        <option value="categorias">Categorías</option>
        <option value="clientes">Clientes</option>
        <option value="finanzas">Finanzas</option>
      </select>

      <select value={filters.periodo} onChange={(e) => handleChange('periodo', e.target.value)} className={Css.filterSelect}>
        <option value="dia">Hoy</option>
        <option value="semana">Esta Semana</option>
        <option value="mes">Este Mes</option>
        <option value="año">Este Año</option>
        <option value="rango">Rango Personalizado</option>
      </select>

      {filters.periodo === 'mes' && (
        <select value={filters.mes} onChange={(e) => handleChange('mes', e.target.value)} className={Css.filterSelect}>
          {Array.from({length: 12}, (_, i) => <option key={i+1} value={i+1}>{new Date(0, i).toLocaleString('es', { month: 'long' })}</option>)}
        </select>
      )}

      {filters.periodo === 'año' && (
        <select value={filters.año} onChange={(e) => handleChange('año', e.target.value)} className={Css.filterSelect}>
          {Array.from({length: 5}, (_, i) => {
            const year = new Date().getFullYear() - i;
            return <option key={year} value={year}>{year}</option>;
          })}
        </select>
      )}

      {filters.periodo === 'rango' && (
        <>
          <input type="date" value={filters.fecha_inicio || ''} onChange={(e) => handleChange('fecha_inicio', e.target.value)} className={Css.filterInput}/>
          <input type="date" value={filters.fecha_fin || ''} onChange={(e) => handleChange('fecha_fin', e.target.value)} className={Css.filterInput}/>
        </>
      )}
    </div>
  );
}

// Componente principal del Dashboard
export function Dashboard() {
  const [filters, setFilters] = useState({
    tipo: 'ventas',
    periodo: 'mes',
    mes: new Date().getMonth() + 1,
    año: new Date().getFullYear()
  });

  const { data, loading, error } = useDashboardData(filters);

  return (
    <Barra>
      <div className={Css.dashboard}>
        <Titulo icon='cube' titulo='DASHBOARD' subtitulo='Dashboard dinámico'>
          <FiltrosDashboard filters={filters} onFilterChange={setFilters} />
        </Titulo>
      
        {loading && (
          <div className={Css.loading}>
            <div className={Css.spinner}></div>
            <p>Cargando datos del dashboard...</p>
          </div>
        )}

        {error && (
          <div className={Css.error}>
            <p>❌ Error: {error}</p>
          </div>
        )}

        {data && (
          <>
            <Metricas metricas={data.metricas_principales} />
            <div className={Css.graficasSection}>
              <GraficaBarras datos={data} />
              <GraficaLineas datos={data} />
            </div>
            <div className={Css.tablasSection}>
              <TablaProductos productos={data.productos_mas_vendidos} />
              <TablaVentas ventas={data.ventas_por_dia} />
            </div>
          </>
        )}

        {!data && !loading && !error && (
          <div className={Css.emptyState}>
            <h3>No hay datos disponibles</h3>
            <p>Selecciona diferentes filtros para ver la información</p>
          </div>
        )}
      </div>
    </Barra>
  );
}
