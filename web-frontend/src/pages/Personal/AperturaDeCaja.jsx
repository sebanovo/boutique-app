import { Titulo } from '../../components/Cabesera/Titulo';
import { Barra } from '../../components/BarraMenu/Barra';
import { Formulario } from '../../components/Formulario/Formulario';
import { useState, useEffect } from 'react';

const dataForm = {
    Titulo: 'Iniciar Caja',
    Backendt: '/api/venta/aperturaCaja/crear/',
    Input: [
        "monto-Monto de Apertura:-number",
    ],
    Recibir: []
};

export function AperturaDeCaja(){
    const [cajasHoy, setCajasHoy] = useState([]);
    const [loading, setLoading] = useState(true);

    // Función para obtener datos de la caja de hoy
    const fetchData = async () => {
        try {
            const response = await fetch('/api/venta/aperturaCaja/extrer/hoy/');
            const data = await response.json();
            setCajasHoy(data);
        } catch (error) {
            console.error('Error al obtener datos:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCajaCreada = () => {
        fetchData();
    };

    return(
        <Barra>
            <Titulo 
                icon='card' 
                titulo='Apertura de Caja' 
                subtitulo='Gestión de caja para ventas presenciales'
            />
            
            <Formulario data={dataForm} onSuccess={handleCajaCreada} />
            
            <br /><br />
            
            <Titulo icon='today' subtitulo='Caja del Día'>
                {loading ? (
                    <p>Cargando...</p>
                ) : cajasHoy.length > 0 ? (
                    <div style={{ background: '#e8f5e8', padding: '15px', borderRadius: '8px', marginTop: '10px' }}>
                        <h4>Caja Activa</h4>
                        {cajasHoy.map((caja, index) => (
                            <div key={index}>
                                <p><strong>Administrador:</strong> {caja.administrador_nombre}</p>
                                <p><strong>Monto Inicial:</strong> Bs. {caja.montoInicio}</p>
                                <p><strong>Fecha:</strong> {caja.fecha}</p>
                                <p><strong>Hora:</strong> {caja.hora}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ background: '#fff3cd', padding: '15px', borderRadius: '8px', marginTop: '10px' }}>
                        <p>No hay caja abierta para hoy.</p>
                    </div>
                )}
            </Titulo>
        </Barra>
    );
}