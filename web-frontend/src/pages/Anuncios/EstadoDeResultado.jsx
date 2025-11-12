import { useState, useEffect, useRef } from "react";
import { Barra } from "../../components/BarraMenu/Barra";
import Css from "../../pages/Anuncios/EstadoResultados.module.css";
import { Titulo } from "../../components/Cabesera/Titulo";

// Hook para obtener estado de resultados
function useEstadoResultados(filters) {
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

        const response = await fetch(`/api/venta/estado-resultados/?${queryParams}`);
        if (!response.ok) throw new Error("Error en la respuesta del servidor");
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

// ------------------- COMPONENTES -------------------

// Resumen Principal
function ResumenPrincipal({ resumen }) {
  if (!resumen) return null;

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("es-BO", { style: "currency", currency: "BOB" }).format(amount);

  return (
    <div className={Css.resumenSection}>
      <h2>
        <ion-icon name="stats-chart-outline"></ion-icon> Resumen del Estado de Resultados
      </h2>
      <div className={Css.resumenGrid}>
        <div className={`${Css.resumenCard} ${Css.ingresos}`} data-tooltip="Total de ingresos generados por ventas antes de costos y gastos">
          <h3>Ingresos por Ventas</h3>
          <div className={Css.monto}>{formatCurrency(resumen.ingresos_ventas)}</div>
        </div>
        <div className={`${Css.resumenCard} ${Css.costos}`} data-tooltip="Suma de los costos de productos vendidos y costos de envío">
          <h3>Costos Directos</h3>
          <div className={Css.monto}>{formatCurrency(resumen.costo_productos_vendidos + resumen.costos_envio)}</div>
          <div className={Css.detalle}>
            <span>Productos: {formatCurrency(resumen.costo_productos_vendidos)}</span>
            <span>Envíos: {formatCurrency(resumen.costos_envio)}</span>
          </div>
        </div>
        <div className={`${Css.resumenCard} ${Css.gananciaBruta}`} data-tooltip="Ingresos menos costos directos">
          <h3>Ganancia Bruta</h3>
          <div className={Css.monto}>{formatCurrency(resumen.ganancia_bruta)}</div>
          <div className={Css.porcentaje}>{resumen.margen_bruto}%</div>
        </div>
        <div className={`${Css.resumenCard} ${Css.gastos}`} data-tooltip="Gastos operativos totales">
          <h3>Gastos Operativos</h3>
          <div className={Css.monto}>{formatCurrency(resumen.total_gastos_operativos)}</div>
        </div>
        <div className={`${Css.resumenCard} ${Css.utilidadOperativa}`} data-tooltip="Ganancia bruta menos gastos">
          <h3>Utilidad Operativa</h3>
          <div className={Css.monto}>{formatCurrency(resumen.utilidad_operativa)}</div>
          <div className={Css.porcentaje}>{resumen.margen_operativo}%</div>
        </div>
        <div className={`${Css.resumenCard} ${Css.utilidadNeta}`} data-tooltip="Utilidad operativa menos impuestos">
          <h3>Utilidad Neta</h3>
          <div className={Css.monto}>{formatCurrency(resumen.utilidad_neta)}</div>
          <div className={Css.porcentaje}>{resumen.margen_neto}%</div>
        </div>
      </div>
    </div>
  );
}

// Detalle de Gastos
function DetalleGastos({ gastos }) {
  if (!gastos) return null;

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("es-BO", { style: "currency", currency: "BOB" }).format(amount);

  // Filtrar solo los gastos principales y calcular total
  const gastosPrincipales = {
    'Costos Laborales': gastos.costos_laborales || 0,
    'Servicios (Agua)': gastos.costos_servicios_agua || 0,
    'Servicios (Internet)': gastos.costos_servicios_internet || 0,
    'Servicios (Luz)': gastos.costos_servicios_luz || 0,
    'Mantenimiento': gastos.costos_mantenimiento || 0,
    'Administrativos': gastos.costos_administrativos || 0,
    'Otros Gastos': gastos.costos_otros || 0
  };

  const total = Object.values(gastosPrincipales).reduce((sum, amount) => sum + amount, 0);

  return (
    <div className={Css.gastosSection}>
      <h3>
        <ion-icon name="eye-outline"></ion-icon> Desglose de Gastos Operativos
      </h3>
      <div className={Css.gastosGrid}>
        {Object.entries(gastosPrincipales).map(([key, value]) => (
          value > 0 && (
            <div key={key} className={Css.gastoItem}>
              <span className={Css.gastoNombre}>{key}</span>
              <span className={Css.gastoMonto}>{formatCurrency(value)}</span>
              <div className={Css.gastoBar}>
                <div 
                  className={Css.gastoBarFill} 
                  style={{ 
                    width: `${total > 0 ? (value / total) * 100 : 0}%` 
                  }}
                ></div>
              </div>
            </div>
          )
        ))}
        {total === 0 && (
          <div className={Css.emptyState}>
            <p>No hay gastos operativos registrados en este período</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Análisis de Resultados
function AnalisisResultados({ analisis, metricas }) {
  if (!analisis) return null;

  return (
    <div className={Css.analisisSection}>
      <h3>
        <ion-icon name="analytics-outline"></ion-icon> Análisis de Resultados
      </h3>
      <div className={Css.analisisGrid}>
        <div className={Css.analisisCard}>
          <h4>Rentabilidad</h4>
          <div className={`${Css.indicador} ${Css[analisis.rentabilidad?.toLowerCase() || 'baja']}`}>
            {analisis.rentabilidad || 'Baja'}
          </div>
          <p>Margen Neto: {analisis.margen_neto || 0}%</p>
        </div>
        <div className={Css.analisisCard}>
          <h4>Eficiencia Operativa</h4>
          <div className={`${Css.indicador} ${Css[analisis.eficiencia_operativa?.toLowerCase() || 'baja']}`}>
            {analisis.eficiencia_operativa || 'Baja'}
          </div>
          <p>Margen Operativo: {analisis.margen_operativo || 0}%</p>
        </div>
        <div className={Css.analisisCard}>
          <h4>Estructura de Costos</h4>
          <div className={Css.porcentajeItem}>
            <span>Costos/Ventas:</span>
            <span>{analisis.costo_porcentaje_ventas || 0}%</span>
          </div>
          <div className={Css.porcentajeItem}>
            <span>Gastos/Ventas:</span>
            <span>{analisis.gastos_porcentaje_ventas || 0}%</span>
          </div>
        </div>
        <div className={Css.analisisCard}>
          <h4>Métricas de Ventas</h4>
          <div className={Css.metricaItem}>
            <span>Total Ventas:</span>
            <span>{metricas?.total_ventas || 0}</span>
          </div>
          <div className={Css.metricaItem}>
            <span>Ticket Promedio:</span>
            <span>Bs. {metricas?.ticket_promedio || 0}</span>
          </div>
          <div className={Css.metricaItem}>
            <span>Productos Vendidos:</span>
            <span>{metricas?.productos_vendidos || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Filtros
function FiltrosEstadoResultados({ filters, onFilterChange }) {
  const handleChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    
    // Resetear fechas cuando se cambia el período
    if (key === 'periodo') {
      if (value === 'mes') {
        newFilters.fecha_inicio = '';
        newFilters.fecha_fin = '';
        newFilters.mes = new Date().getMonth() + 1;
        newFilters.año = new Date().getFullYear();
      } else if (value === 'año') {
        newFilters.fecha_inicio = '';
        newFilters.fecha_fin = '';
        newFilters.mes = '';
        newFilters.año = new Date().getFullYear();
      } else if (value === 'rango') {
        newFilters.mes = '';
        newFilters.año = '';
      }
    }
    
    onFilterChange(newFilters);
  };

  const currentYear = new Date().getFullYear();
  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: new Date(0, i).toLocaleString("es", { month: "long" })
  }));

  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  return (
    <div className={Css.filtros}>
      <select 
        value={filters.periodo} 
        onChange={(e) => handleChange("periodo", e.target.value)} 
        className={Css.filterSelect}
      >
        <option value="mes">Este Mes</option>
        <option value="año">Este Año</option>
        <option value="rango">Rango Personalizado</option>
      </select>
      
      {filters.periodo === "mes" && (
        <>
          <select 
            value={filters.mes} 
            onChange={(e) => handleChange("mes", e.target.value)} 
            className={Css.filterSelect}
          >
            {months.map(month => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
          <select 
            value={filters.año} 
            onChange={(e) => handleChange("año", e.target.value)} 
            className={Css.filterSelect}
          >
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </>
      )}
      
      {filters.periodo === "año" && (
        <select 
          value={filters.año} 
          onChange={(e) => handleChange("año", e.target.value)} 
          className={Css.filterSelect}
        >
          {years.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      )}
      
      {filters.periodo === "rango" && (
        <>
          <input 
            type="date" 
            value={filters.fecha_inicio || ""} 
            onChange={(e) => handleChange("fecha_inicio", e.target.value)} 
            className={Css.filterInput} 
            placeholder="Fecha inicio"
          />
          <input 
            type="date" 
            value={filters.fecha_fin || ""} 
            onChange={(e) => handleChange("fecha_fin", e.target.value)} 
            className={Css.filterInput} 
            placeholder="Fecha fin"
          />
        </>
      )}
    </div>
  );
}

// ------------------- COMPONENTE PRINCIPAL -------------------
export function EstadoResultados() {
  const [filters, setFilters] = useState({
    periodo: "mes",
    mes: new Date().getMonth() + 1,
    año: new Date().getFullYear(),
    fecha_inicio: "",
    fecha_fin: ""
  });

  const { data, loading, error } = useEstadoResultados(filters);

  return (
    <Barra>
      <div className={Css.estadoResultados}>
        <Titulo 
          icon="chart" 
          titulo="ESTADO DE RESULTADOS" 
          subtitulo="Análisis financiero detallado"
        >
          <FiltrosEstadoResultados filters={filters} onFilterChange={setFilters} />
        </Titulo>

        {loading && (
          <div className={Css.loading}>
            <div className={Css.spinner}></div>
            <p>Calculando estado de resultados...</p>
          </div>
        )}

        {error && (
          <div className={Css.error}>
            <p>❌ Error: {error}</p>
          </div>
        )}

        {data && (
          <>
            <ResumenPrincipal resumen={data.resumen} />
            <div className={Css.detalleSection}>
              <DetalleGastos gastos={data.detalle_gastos_operativos} />
              <AnalisisResultados 
                analisis={data.analisis_margenes} 
                metricas={data.metricas_adicionales} 
              />
            </div>
            {data.metadatos && (
              <div className={Css.metadatos}>
                <p><strong>Período analizado:</strong> {data.metadatos.rango_fechas}</p>
                <p><strong>Generado el:</strong> {new Date(data.metadatos.fecha_generacion).toLocaleString('es-BO')}</p>
              </div>
            )}
          </>
        )}

        {!data && !loading && !error && (
          <div className={Css.emptyState}>
            <h3>No hay datos financieros disponibles</h3>
            <p>Selecciona un período diferente para ver el estado de resultados</p>
          </div>
        )}
      </div>
    </Barra>
  );
}