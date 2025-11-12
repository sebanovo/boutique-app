from django.db.models import Sum, F, Q
from rest_framework.views import APIView
from rest_framework.response import Response
from datetime import datetime, timedelta
import calendar
from decimal import Decimal

from boutique.models import (
    Venta, VentaDetalle, Producto, CostoLaboral,
    CostoIndirecto, CostoEnvio, AperturaCaja
)

class EstadoResultadosAPI(APIView):

    def get(self, request):
        periodo = request.GET.get('periodo', 'mes')
        fecha_inicio = request.GET.get('fecha_inicio')
        fecha_fin = request.GET.get('fecha_fin')
        mes = request.GET.get('mes')
        año = request.GET.get('año')

        filtros_ventas, rango_fechas = self._construir_filtros_fecha(
            periodo, fecha_inicio, fecha_fin, mes, año
        )

        estado_resultados = self._calcular_estado_resultados(filtros_ventas)

        estado_resultados['metadatos'] = {
            'periodo': periodo,
            'rango_fechas': rango_fechas,
            'fecha_generacion': datetime.now().strftime('%Y-%m-%d %H:%M'),
            'mes': mes,
            'año': año
        }

        return Response(estado_resultados)

    def _construir_filtros_fecha(self, periodo, fecha_inicio, fecha_fin, mes, año):
        hoy = datetime.now().date()
        filtros = Q()
        rango_texto = ""

        if periodo == 'mes':
            if mes and año:
                year = int(año)
                month = int(mes)
            else:
                year, month = hoy.year, hoy.month
            start_date = datetime(year, month, 1).date()
            end_date = datetime(year, month, calendar.monthrange(year, month)[1]).date()
            filtros &= Q(fecha__date__range=[start_date, end_date])
            rango_texto = f"{start_date.strftime('%B %Y')}".title()

        elif periodo == 'año':
            year = int(año) if año else hoy.year
            start_date = datetime(year, 1, 1).date()
            end_date = datetime(year, 12, 31).date()
            filtros &= Q(fecha__date__range=[start_date, end_date])
            rango_texto = f"Año {year}"

        elif periodo == 'rango' and fecha_inicio and fecha_fin:
            try:
                start_date = datetime.strptime(fecha_inicio, '%Y-%m-%d').date()
                end_date = datetime.strptime(fecha_fin, '%Y-%m-%d').date()
                filtros &= Q(fecha__date__range=[start_date, end_date])
                rango_texto = f"{start_date} a {end_date}"
            except ValueError:
                start_date = hoy.replace(day=1)
                end_date = hoy.replace(day=calendar.monthrange(hoy.year, hoy.month)[1])
                filtros &= Q(fecha__date__range=[start_date, end_date])
                rango_texto = f"{start_date.strftime('%B %Y')}".title()

        return filtros, rango_texto

    def _calcular_estado_resultados(self, filtros_ventas):
        """Calcula el estado de resultados completo usando Decimal"""

        # ==================== INGRESOS ====================
        ventas = Venta.objects.filter(filtros_ventas)

        # Calcular ingresos sumando los subtotales de los detalles de venta
        ingresos_ventas = VentaDetalle.objects.filter(
            venta__in=ventas
        ).aggregate(total=Sum('subtotal'))['total'] or Decimal('0')

        # ==================== COSTOS DIRECTOS ====================
        detalles_venta = VentaDetalle.objects.filter(
            venta__in=ventas
        ).select_related('producto')

        # Calcular costo de productos vendidos
        costo_productos_vendidos = sum(
            (detalle.producto.costo_unitario if detalle.producto else Decimal('0')) * detalle.cantidad
            for detalle in detalles_venta
        )

        # Costos de envío
        costos_envio = CostoEnvio.objects.filter(
            venta__in=ventas
        ).aggregate(total=Sum('costo_transporte'))['total'] or Decimal('0')

        # Ganancia bruta
        ganancia_bruta = ingresos_ventas - costo_productos_vendidos - costos_envio
        margen_bruto = (ganancia_bruta / ingresos_ventas * Decimal('100')) if ingresos_ventas > 0 else Decimal('0')

        # ==================== GASTOS OPERATIVOS ====================
        fecha_inicio = self._obtener_fecha_inicio(filtros_ventas)
        fecha_fin = self._obtener_fecha_fin(filtros_ventas)

        # Costos laborales
        costos_laborales = CostoLaboral.objects.filter(
            fecha__range=[fecha_inicio, fecha_fin]
        ).aggregate(
            total=Sum(F('horas_trabajadas') * F('pago_por_hora'))
        )['total'] or Decimal('0')

        # Costos indirectos por tipo
        costos_indirectos = CostoIndirecto.objects.filter(
            fecha__range=[fecha_inicio, fecha_fin]
        )

        # Agrupar costos indirectos por tipo según tus modelos
        costos_servicios_agua = costos_indirectos.filter(tipo='servicio agua').aggregate(total=Sum('monto'))['total'] or Decimal('0')
        costos_servicios_internet = costos_indirectos.filter(tipo='servicio internet').aggregate(total=Sum('monto'))['total'] or Decimal('0')
        costos_servicios_luz = costos_indirectos.filter(tipo='servicio luz').aggregate(total=Sum('monto'))['total'] or Decimal('0')
        costos_mantenimiento = costos_indirectos.filter(tipo='mantenimiento').aggregate(total=Sum('monto'))['total'] or Decimal('0')
        costos_administrativos = costos_indirectos.filter(tipo='administrativo').aggregate(total=Sum('monto'))['total'] or Decimal('0')
        costos_otros = costos_indirectos.filter(tipo='otros').aggregate(total=Sum('monto'))['total'] or Decimal('0')

        # Sumar todos los servicios
        costos_servicios = costos_servicios_agua + costos_servicios_internet + costos_servicios_luz

        total_gastos_operativos = (costos_laborales + costos_servicios + 
                                 costos_mantenimiento + costos_administrativos + costos_otros)

        # ==================== RESULTADOS ====================
        utilidad_operativa = ganancia_bruta - total_gastos_operativos
        margen_operativo = (utilidad_operativa / ingresos_ventas * Decimal('100')) if ingresos_ventas > 0 else Decimal('0')

        impuestos = utilidad_operativa * Decimal('0.25')  # 25% de impuestos
        utilidad_neta = utilidad_operativa - impuestos
        margen_neto = (utilidad_neta / ingresos_ventas * Decimal('100')) if ingresos_ventas > 0 else Decimal('0')

        # ==================== MÉTRICAS ADICIONALES ====================
        total_ventas_count = ventas.count()
        ticket_promedio = ingresos_ventas / total_ventas_count if total_ventas_count > 0 else Decimal('0')

        # Ventas por método de pago
        ventas_por_metodo = ventas.values('tipo_pago__nombre').annotate(
            total=Sum('detalles__subtotal')
        ).order_by('-total')

        productos_vendidos = detalles_venta.aggregate(total=Sum('cantidad'))['total'] or 0

        # Análisis de eficiencia
        costo_porcentaje_ventas = (costo_productos_vendidos / ingresos_ventas * Decimal('100')) if ingresos_ventas > 0 else Decimal('0')
        gastos_porcentaje_ventas = (total_gastos_operativos / ingresos_ventas * Decimal('100')) if ingresos_ventas > 0 else Decimal('0')

        return {
            'resumen': {
                'ingresos_ventas': float(ingresos_ventas),
                'costo_productos_vendidos': float(costo_productos_vendidos),
                'costos_envio': float(costos_envio),
                'ganancia_bruta': float(ganancia_bruta),
                'margen_bruto': round(float(margen_bruto), 2),
                'total_gastos_operativos': float(total_gastos_operativos),
                'utilidad_operativa': float(utilidad_operativa),
                'margen_operativo': round(float(margen_operativo), 2),
                'impuestos': float(impuestos),
                'utilidad_neta': float(utilidad_neta),
                'margen_neto': round(float(margen_neto), 2),
            },
            'detalle_gastos_operativos': {
                'costos_laborales': float(costos_laborales),
                'costos_servicios_agua': float(costos_servicios_agua),
                'costos_servicios_internet': float(costos_servicios_internet),
                'costos_servicios_luz': float(costos_servicios_luz),
                'costos_servicios_total': float(costos_servicios),
                'costos_mantenimiento': float(costos_mantenimiento),
                'costos_administrativos': float(costos_administrativos),
                'costos_otros': float(costos_otros),
            },
            'metricas_adicionales': {
                'total_ventas': total_ventas_count,
                'ticket_promedio': round(float(ticket_promedio), 2),
                'productos_vendidos': productos_vendidos,
                'ventas_por_metodo_pago': list(ventas_por_metodo),
            },
            'analisis_margenes': {
                'costo_porcentaje_ventas': round(float(costo_porcentaje_ventas), 2),
                'gastos_porcentaje_ventas': round(float(gastos_porcentaje_ventas), 2),
                'rentabilidad': 'Alta' if margen_neto > 20 else 'Media' if margen_neto > 10 else 'Baja',
                'eficiencia_operativa': 'Alta' if margen_operativo > 15 else 'Media' if margen_operativo > 5 else 'Baja'
            }
        }

    def _obtener_fecha_inicio(self, filtros_ventas):
        try:
            primera_venta = Venta.objects.filter(filtros_ventas).earliest('fecha')
            return primera_venta.fecha.date()
        except Venta.DoesNotExist:
            return datetime.now().date().replace(day=1)

    def _obtener_fecha_fin(self, filtros_ventas):
        try:
            ultima_venta = Venta.objects.filter(filtros_ventas).latest('fecha')
            return ultima_venta.fecha.date()
        except Venta.DoesNotExist:
            return datetime.now().date()